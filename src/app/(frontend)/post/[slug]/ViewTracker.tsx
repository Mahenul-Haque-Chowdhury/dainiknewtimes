"use client";

import { useEffect } from "react";
import { trackView } from "../../actions";

interface ViewTrackerProps {
  articleId: number | string;
}

export default function ViewTracker({ articleId }: ViewTrackerProps) {
  useEffect(() => {
    trackView(articleId);
  }, [articleId]);

  return null;
}
