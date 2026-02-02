import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

export default function Valentine() {
    const zoneRef = useRef(null);
    const noBtnRef = useRef(null);
    const canvasRef = useRef(null);

    const [accepted, setAccepted] = useState(false);
    const [yesScale, setYesScale] = useState(1);

    /* ---------- CONFETTI SETUP ---------- */
    useEffect(() => {
        const canvas = canvasRef.current;
        const resize = () => {
            const dpr = Math.max(1, window.devicePixelRatio || 1);
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = "100vw";
            canvas.style.height = "100vh";
        };
        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    const confettiInstance = confetti.create(canvasRef.current, {
        resize: false,
        useWorker: true
    });

    const fireConfetti = () => {
        const end = Date.now() + 1600;
        (function frame() {
            confettiInstance({
                particleCount: 12,
                spread: 90,
                startVelocity: 45,
                ticks: 180,
                origin: { x: Math.random(), y: Math.random() * 0.3 }
            });
            if (Date.now() < end) requestAnimationFrame(frame);
        })();

        setTimeout(() => {
            confettiInstance({
                particleCount: 300,
                spread: 140,
                startVelocity: 60,
                ticks: 220,
                origin: { x: 0.5, y: 0.55 }
            });
        }, 300);
    };

    /* ---------- NO BUTTON LOGIC ---------- */
    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    const moveNo = (x, y) => {
        const zone = zoneRef.current.getBoundingClientRect();
        const btn = noBtnRef.current.getBoundingClientRect();

        let dx = (btn.left + btn.width / 2) - x;
        let dy = (btn.top + btn.height / 2) - y;
        const mag = Math.hypot(dx, dy) || 1;
        dx /= mag;
        dy /= mag;

        let left = (btn.left - zone.left) + dx * 150;
        let top = (btn.top - zone.top) + dy * 150;

        left = clamp(left, 0, zone.width - btn.width);
        top = clamp(top, 0, zone.height - btn.height);

        noBtnRef.current.style.left = `${left}px`;
        noBtnRef.current.style.top = `${top}px`;

        setYesScale(s => Math.min(2.2, s + 0.1));
    };

    const handlePointerMove = e => {
        const btn = noBtnRef.current.getBoundingClientRect();
        const d = Math.hypot(
            (btn.left + btn.width / 2) - e.clientX,
            (btn.top + btn.height / 2) - e.clientY
        );
        if (d < 140) moveNo(e.clientX, e.clientY);
    };

    /* ---------- YES CLICK ---------- */
    const handleYes = () => {
        setAccepted(true);
        fireConfetti();
    };

    return (
        <div className="min-h-screen grid place-items-center bg-gradient-to-b from-pink-100 to-pink-200 overflow-hidden">
            <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />

            <main className="relative w-[92vw] max-w-xl bg-white/80 backdrop-blur-xl rounded-3xl p-6 text-center shadow-2xl">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-8">
                    Nirali, will you be my Valentine? 💖
                </h1>

                {!accepted && (
                    <section
                        ref={zoneRef}
                        onPointerMove={handlePointerMove}
                        className="relative mx-auto w-full max-w-md h-40 touch-none"
                    >
                        <button
                            onClick={handleYes}
                            style={{ transform: `translateY(-50%) scale(${yesScale})` }}
                            className="absolute left-[18%] top-1/2 bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full font-bold shadow-lg transition"
                        >
                            Yes
                        </button>

                        <button
                            ref={noBtnRef}
                            onClick={e => e.preventDefault()}
                            className="absolute left-[62%] top-1/2 -translate-y-1/2 bg-gray-200 text-gray-900 px-8 py-4 rounded-full font-bold shadow-lg select-none"
                        >
                            No
                        </button>
                    </section>
                )}

                {accepted && (
                    <div className="animate-pop">
                        <h2 className="text-4xl font-extrabold mt-6">YAY! 🎉</h2>
                        <img
                            className="mx-auto mt-4 max-w-xs"
                            src="https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif"
                            alt="Fireworks"
                        />
                    </div>
                )}
            </main>
        </div>
    );
}
