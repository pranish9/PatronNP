import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { Coffee } from "lucide-react";

import { getPublicStreamAlertSettings } from "../services/streamAlertService";

const POSITION_CLASSES = {
  TOP_LEFT: "top-6 left-6 items-start text-left",
  TOP_CENTER: "top-6 left-1/2 -translate-x-1/2 items-center text-center",
  TOP_RIGHT: "top-6 right-6 items-end text-right",
  CENTER_LEFT: "top-1/2 left-6 -translate-y-1/2 items-start text-left",
  CENTER_RIGHT: "top-1/2 right-6 -translate-y-1/2 items-end text-right",
  BOTTOM_LEFT: "bottom-6 left-6 items-start text-left",
  BOTTOM_CENTER: "bottom-6 left-1/2 -translate-x-1/2 items-center text-center",
  BOTTOM_RIGHT: "bottom-6 right-6 items-end text-right",
};

const ALERT_DURATION_MS = 8000;

const StreamAlertOverlay = () => {
  const { userKey } = useParams();
  const [ready, setReady] = useState(false);
  const [alert, setAlert] = useState(null);
  const audioRef = useRef(null);
  const hideTimerRef = useRef(null);

  useEffect(() => {
    document.body.style.background = "transparent";
    getPublicStreamAlertSettings(userKey)
      .then(() => setReady(true))
      .catch(() => {});
  }, [userKey]);

  useEffect(() => {
    if (!userKey) return;

    const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:8080/api").replace(/\/api\/?$/, "");

    const client = new Client({
      webSocketFactory: () => new SockJS(`${apiBase}/ws`),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/stream-alert/${userKey}`, (message) => {
          // Every alert carries its own snapshot of style settings (position, color,
          // CTA, opacity, sound) at broadcast time, so the overlay always reflects
          // the latest saved settings even if this browser-source page has been
          // open for hours without a reload.
          const event = JSON.parse(message.body);
          setAlert(event);

          if (audioRef.current && event.soundFile && event.soundFile !== "none") {
            audioRef.current.src = `/sounds/${event.soundFile}`;
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }

          if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
          hideTimerRef.current = setTimeout(() => setAlert(null), ALERT_DURATION_MS);
        });
      },
    });

    client.activate();

    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      client.deactivate();
    };
  }, [userKey]);

  if (!ready) return null;

  const positionClass = (alert && POSITION_CLASSES[alert.position]) || POSITION_CLASSES.BOTTOM_LEFT;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden bg-transparent">
      <audio ref={audioRef} />

      {alert && (
        <div className={`fixed flex flex-col gap-2 max-w-xs sm:max-w-sm ${positionClass} animate-in fade-in slide-in-from-bottom-4 duration-300`}>
          <Coffee size={40} className="text-amber-300 animate-bounce self-center" />
          <p
            className="font-bold text-base sm:text-lg leading-snug break-words drop-shadow-lg"
            style={{ color: alert.textColor || "#FFFFFF" }}
          >
            {alert.text}
          </p>
          {alert.ctaText && (
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
              style={{
                backgroundColor: `rgba(0,0,0,${(alert.ctaOpacity ?? 100) / 100})`,
                color: alert.textColor || "#FFFFFF",
              }}
            >
              <Coffee size={14} className="text-amber-300" />
              {alert.ctaText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StreamAlertOverlay;
