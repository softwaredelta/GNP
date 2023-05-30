// (c) Delta Software 2023, rights reserved.

import ReactDOM from "react-dom";
import loader from "../../assets/imgs/loading.gif";

export default function BlockPage() {
  return ReactDOM.createPortal(
    <div className="fixed top-0 z-[999] flex h-full w-full items-center justify-center bg-white/50">
      <div className="h-24 w-24">
        <img src={loader} alt="" />
      </div>
    </div>,
    document.getElementById("loader-root") as HTMLElement,
  );
}
