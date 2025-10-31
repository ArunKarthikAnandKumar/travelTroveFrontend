import { useEffect, useState } from "react";

type AlertMsg = {
    type: "success"|"danger"|"warning"|"info";
    title?: string;
    message: string;
    duration?: number;
    onclose?: () => void;

};

const AlertMessage: React.FC<AlertMsg> = ({
    type,
    title,
    message,
    duration = 1500 ,
    onclose,
}) => {
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onclose){
                onclose();

            } 
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onclose]);

    if (!visible) return null;

    const alertColors: Record<string, string> = {
        success: "#d1e7dd",
        danger: "#f8d7da",
        warning: "#fff3cd",
        info: "#cff4fc",

    };

    const textColors: Record<string, string> = {
        success: "#0f5132",
        danger: "#842029",
        warning: "#664d03",
        info: "#055160",

    };

    return (
        <div
            className="position-fixed top-5 end-0 m-3 rounded-3 p-3 fade show"
            style={{
                backgroundColor: alertColors[type],
                color: textColors[type],
                minWidth: "500px",
                maxWidth: "360px",
                zIndex: 950,
                borderLeft: `6px solid ${textColors[type]}`,
                transition: "all 0.3s ease-in-out",
            }}
            role="alert"
        >
            <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                    <strong className="d-block mb-1" style={{ fontSize: "1.05rem" }}>
                        {title || type.charAt(0).toUpperCase() + type.slice(1)}
                    </strong>
                    <span style={{ fontSize: "0.9rem", opacity: 0.9 }}>{message}</span>
                </div>
                <button
                    type="button"
                    className="btn-close ms-2"
                    aria-label="close"
                    onClick={() => {
                        setVisible(false);
                        if (onclose) onclose();
                    }}
                ></button>
            </div>
        </div>

    );

};

export default AlertMessage;