"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

export interface SentinelState {
  isSlouching: boolean;
  phoneDetected: boolean;
  multiplePeople: boolean;
  eyeStrainRisk: boolean;
  active: boolean;
}

export const useSentinelVision = () => {
  const [state, setState] = useState<SentinelState>({
    isSlouching: false,
    phoneDetected: false,
    multiplePeople: false,
    eyeStrainRisk: false,
    active: false,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const modelsRef = useRef<{
    pose: poseDetection.PoseDetector | null;
    object: cocoSsd.ObjectDetection | null;
  }>({ pose: null, object: null });

  const loadModels = async () => {
    try {
      await tf.ready();
      const poseModel = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
      );
      const objectModel = await cocoSsd.load();
      
      modelsRef.current = { pose: poseModel, object: objectModel };
      setState(s => ({ ...s, active: true }));
    } catch (error) {
      console.error("Sentinel Vision: Model Loading Failed", error);
    }
  };

  const detect = useCallback(async () => {
    if (!videoRef.current || !modelsRef.current.pose || !modelsRef.current.object) return;

    const video = videoRef.current;
    if (video.readyState < 2) return;

    // Running Parallel Inference
    const [poses, objects] = await Promise.all([
      modelsRef.current.pose.estimatePoses(video),
      modelsRef.current.object.detect(video),
    ]);

    let isSlouching = false;
    let phoneDetected = false;
    let multiplePeople = false;

    // 1. Posture Check
    if (poses.length > 0) {
      const pose = poses[0];
      const nose = pose.keypoints.find(k => k.name === 'nose');
      const shoulderL = pose.keypoints.find(k => k.name === 'left_shoulder');
      const shoulderR = pose.keypoints.find(k => k.name === 'right_shoulder');

      if (nose && shoulderL && shoulderR) {
          const shoulderAvgY = (shoulderL.y + shoulderR.y) / 2;
          // Logic: If nose is too close to shoulder level, user is slouching
          if (Math.abs(shoulderAvgY - nose.y) < 50) isSlouching = true;
      }
    }

    // 2. Object & People Check
    let personCount = 0;
    objects.forEach(obj => {
      if (obj.class === 'cell phone' && obj.score > 0.6) phoneDetected = true;
      if (obj.class === 'person') personCount++;
    });

    if (personCount > 1) multiplePeople = true;

    setState(prev => ({
      ...prev,
      isSlouching,
      phoneDetected,
      multiplePeople,
    }));

    rafRef.current = requestAnimationFrame(detect);
  }, []);

  const startVision = async (videoElement: HTMLVideoElement) => {
    videoRef.current = videoElement;
    await loadModels();
    detect();
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [detect]);

  return { state, startVision };
};
