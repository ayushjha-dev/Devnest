import { Check, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface FeedbackToastProps {
  type: "correct" | "wrong" | null;
  message: string;
  onClose?: () => void;
  duration?: number;
}

export const FeedbackToast: React.FC<FeedbackToastProps> = ({
  type,
  message,
  onClose,
  duration = 3000,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (type) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [type, duration, onClose]);

  if (!type) return null;

  const isCorrect = type === "correct";

  return (
    <div
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ maxWidth: "90%", width: "400px" }}
    >
      <div
        className={`glass-card p-4 ${isCorrect ? "feedback-correct" : "feedback-wrong"}`}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: isCorrect
                ? "rgba(74, 255, 176, 0.2)"
                : "rgba(255, 107, 129, 0.2)",
            }}
          >
            {isCorrect ? (
              <Check className="w-5 h-5" style={{ color: "#4AFFB0" }} />
            ) : (
              <X className="w-5 h-5" style={{ color: "#FF6B81" }} />
            )}
          </div>
          <div className="flex-1">
            <div
              className="font-semibold mb-1"
              style={{ color: isCorrect ? "#4AFFB0" : "#FF6B81" }}
            >
              {isCorrect ? "Correct!" : "Not quite"}
            </div>
            <div className="text-sm" style={{ color: "#F5F7FA" }}>
              {message}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
