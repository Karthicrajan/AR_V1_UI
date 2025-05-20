"use client";
import dynamic from "next/dynamic";
import React from "react";

const ExcelViewer = dynamic(() => import("./ExcelViewer"), { ssr: false });

const ExcelViewerClient = () => <ExcelViewer />;

export default ExcelViewerClient; 