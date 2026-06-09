// "use client";

// import { useEffect } from "react";

// export function CustomCursor() {
//   useEffect(() => {
//     const dot = document.createElement("div");
//     dot.id = "cursor-dot";
//     const ring = document.createElement("div");
//     ring.id = "cursor-ring";
//     document.body.appendChild(dot);
//     document.body.appendChild(ring);

//     let mx = 0, my = 0, rx = 0, ry = 0;
//     let raf: number;

//     const onMove = (e: MouseEvent) => {
//       mx = e.clientX; my = e.clientY;
//       dot.style.left = mx + "px";
//       dot.style.top = my + "px";
//     };

//     const loop = () => {
//       rx += (mx - rx) * 0.11;
//       ry += (my - ry) * 0.11;
//       ring.style.left = rx + "px";
//       ring.style.top = ry + "px";
//       raf = requestAnimationFrame(loop);
//     };

//     document.addEventListener("mousemove", onMove);
//     loop();

//     document.addEventListener("mouseover", (e) => {
//       const interactive = (e.target as Element)?.closest("a, button, [role=button]");
//       if (interactive) {
//         dot.style.width = "12px"; dot.style.height = "12px";
//         ring.style.width = "44px"; ring.style.height = "44px";
//       } else {
//         dot.style.width = "7px"; dot.style.height = "7px";
//         ring.style.width = "30px"; ring.style.height = "30px";
//       }
//     });

//     return () => {
//       document.removeEventListener("mousemove", onMove);
//       cancelAnimationFrame(raf);
//       dot.remove(); ring.remove();
//     };
//   }, []);

//   return null;
// }