import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import Exit from "../svgs/exit";
import ActionButton from "./actionButton";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export const Drawer = ({ isOpen, onClose, children, title = "Drawer Title" }: DrawerProps) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  if (!isBrowser) return null;

  return (
    <AnimatePresence mode="sync">
      {isOpen && (
        <>
          <motion.div
            key="drawer-content"
            initial={{ x: "100%", y: "20%" }}
            animate={{ x: "-3vw", y: "25vh" }}
            exit={{ x: "100%", y: "20%" }}
            transition={{
              type: "tween",
              ease: [0.32, 0.72, 0, 1],
              duration: 0.3
            }}
            className="cyberpunk border border-pink primary-mixin fixed inset-y-0 right-0 z-70 w-full max-w-lg bg-black/50 backdrop-blur-sm h-[calc(70vh-64px)]"
            data-augmented-ui="tl-clip tr-clip-x br-clip-x bl-clip both"
          >
            <div className="flex h-full flex-col bg-gray-900/90 p-4"
            >
              <div className="mt-4 text-gray-300">
                {children}
              </div>
            </div>
          </motion.div>
          <motion.div
            key="drawer-close"
            initial={{ x: "100%", y: "20%" }}
            animate={{ x: "-3vw", y: "15vh" }}
            exit={{ x: "100%", y: "20%" }}
            transition={{
              type: "tween",
              ease: [0.32, 0.72, 0, 1],
              duration: 0.3
            }}
            className="fixed inset-y-0 right-0 z-90 max-w-sm"
          >
            <ActionButton
              handleClick={() => onClose()}
            >
              <Exit />
            </ActionButton>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Drawer;