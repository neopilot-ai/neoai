"use client";

import { useEffect, useRef } from "react";

export function DevMessage() {
  const ref = useRef(undefined);

  useEffect(() => {
    if (!ref.current) {
      console.log(`
      -------------------------------------------------
        ███╗   ███╗██╗██████╗ ██████╗  █████╗ ██╗   ██╗
      ████╗ ████║██║██╔══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝
      ██╔████╔██║██║██║  ██║██║  ██║███████║ ╚████╔╝ 
      ██║╚██╔╝██║██║██║  ██║██║  ██║██╔══██║  ╚██╔╝  
      ██║ ╚═╝ ██║██║██████╔╝██████╔╝██║  ██║   ██║   
      ╚═╝     ╚═╝╚═╝╚═════╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   
      -------------------------------------------------
    We are open source: https://git.new/neoai
    Join the community: https://go.neoai.khulnasoft.com/anPiuRx
    
    `);
      ref.current = true;
    }
  }, []);

  return null;
}
