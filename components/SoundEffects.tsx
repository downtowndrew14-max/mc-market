"use client";

export default function SoundEffects() {
  if (typeof window === "undefined") return null;

  const playHover = () => {
    const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHAU2jdXvzn0pBSh+zPDhkj0KFV+16+qnVRQLRp/g8r5sIQUrgc7y2Yk2CBhkuezooVARDEyl4fG5ZRwFNo3V7859KQUofsz");
    audio.volume = 0.1;
    audio.play().catch(() => {});
  };

  const playClick = () => {
    const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHAU2jdXvzn0pBSh+zPDhkj0KFV+16+qnVRQLRp/g8r5sIQUrgc7y2Yk2CBhkuezooVARDEyl4fG5ZRwFNo3V7859KQUofsz");
    audio.volume = 0.15;
    audio.play().catch(() => {});
  };

  // Attach global event listeners
  if (typeof window !== "undefined") {
    document.addEventListener("mouseover", (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("float-card") || target.closest(".float-card")) {
        playHover();
      }
    });

    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "BUTTON" || target.tagName === "A" || target.closest("button") || target.closest("a")) {
        playClick();
      }
    });
  }

  return null;
}
