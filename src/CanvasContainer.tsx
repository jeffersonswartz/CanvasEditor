import React, { useCallback, useRef, useState } from "react";
import CanvasComponent from "./Components/CanvasComponent";
import Toolbar from "./Components/Toolbar";

export const CanvasContext = React.createContext<ICanvasContext>({});

export interface ICanvasData {
  component?: string;
  id?: string;
  position?: { top: number; left: number };
  dimension?: { width: string; height: string };
  content?: string;
  type: string;
}

export interface ICanvasComponent {
  position?: { top: number; left: number };
  dimension?: { width: string; height: string };
  content?: string;
  id?: string;
  type: string;
  isReadOnly?: boolean;
}

export interface ICanvasContext {
  state?: {
    canvasData: ICanvasData[];
    activeSelection: Set<string>;
    enableQuillToolbar: boolean;
  };
  actions?: {
    setCanvasData: React.Dispatch<React.SetStateAction<ICanvasData[]>>;
    setActiveSelection: React.Dispatch<React.SetStateAction<Set<string>>>;
    updateCanvasData: (data: Partial<ICanvasComponent>) => void;
    addElement: (type: string) => void;
    setEnableQuillToolbar: (state: boolean) => void;
  };
}

const getInitialData = (data: any[], type: string = "TEXT") => {
  return {
    type: type,
    id: `${type}__${Date.now()}__${data.length}`,
    position: {
      top: 100,
      left: 100
    },
    dimension: {
      width: "150",
      height: type === "TEXT" ? "50" : "150"
    },
    content: type === "TEXT" ? "Sample Text" : ""
  };
};

const exampleData = [
  {
    type: "IMAGE",
    id: "IMAGE__1616154982257__0",
    position: { left: -1, top: -21.919998168945312 },
    dimension: { width: "114px", height: "114px" },
    content:
      "data:image/png;base64,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"
  },
  {
    type: "TEXT",
    id: "TEXT__1616155060789__1",
    position: { left: 126, top: 16.080001831054688 },
    dimension: { width: "174px", height: "50px" },
    content:
      '<p><strong style="font-family: &quot;Trebuchet MS&quot;; font-size: 20px;">Visual BI Solutions</strong></p>'
  },
  {
    type: "TEXT",
    id: "TEXT__1616155106456__2",
    position: { left: 130, top: 43 },
    dimension: { width: "100px", height: "50px" },
    content: "<p>Invoice</p>"
  },
  {
    type: "TEXT",
    id: "TEXT__1616155168276__3",
    position: { left: 1065, top: 9 },
    dimension: { width: "150", height: "50" },
    content:
      "<p><strong>Date: </strong>18/Mar/2021</p><p><strong>Time: </strong>5.30PM</p>"
  },
  {
    type: "TEXT",
    id: "TEXT__1616155232172__4",
    position: { left: 3, top: 86.08000183105469 },
    dimension: { width: "1220px", height: "254px" },
    content:
      '<p class="ql-align-center"><span style="font-size: 20px;">Table Here</span></p>'
  },
  {
    type: "TEXT",
    id: "TEXT__1616155336963__5",
    position: { left: 19, top: 383.99998474121094 },
    dimension: { width: "153px", height: "50px" },
    content:
      '<p><strong style="font-size: 12px;">Account Info : </strong><span style="font-size: 12px;"> #123213</span></p>'
  },
  {
    type: "TEXT",
    id: "TEXT__1616155481995__6",
    position: { top: 355.99998474121094, left: 21 },
    dimension: { width: "113px", height: "50px" },
    content:
      '<p><strong style="color: rgb(0, 102, 204); font-size: 16px;"><u>Payment Info</u></strong></p>'
  },
  {
    type: "TEXT",
    id: "TEXT__1616155611972__7",
    position: { left: 20, top: 408.0800018310547 },
    dimension: { width: "150", height: "50" },
    content:
      '<p><strong style="font-size: 12px;">A/C Name : </strong><span style="font-size: 12px;">Foo</span></p>'
  },
  {
    type: "TEXT",
    id: "TEXT__1616155645627__8",
    position: { left: 19, top: 431.1600036621094 },
    dimension: { width: "150", height: "50" },
    content:
      '<p><strong style="font-size: 12px;">Bank A/C : </strong><span style="font-size: 12px;">Bar</span></p>'
  },
  {
    type: "TEXT",
    id: "TEXT__1616156900518__9",
    position: { left: 909, top: 390 },
    dimension: { width: "100px", height: "50px" },
    content: "<p><strong>Sub-Total</strong></p>"
  },
  {
    type: "TEXT",
    id: "TEXT__1616156928404__10",
    position: { left: 909, top: 413 },
    dimension: { width: "150", height: "50" },
    content: "<p>Tax Vat (15%)</p>"
  },
  {
    type: "TEXT",
    id: "TEXT__1616156951623__11",
    position: { left: 910, top: 436.0800018310547 },
    dimension: { width: "100px", height: "50px" },
    content: "<p>Discount (5%)</p>"
  },
  {
    type: "TEXT",
    id: "TEXT__1616157060762__12",
    position: { left: 1021, top: 389 },
    dimension: { width: "150", height: "50" },
    content: "<p>$400.00</p>"
  },
  {
    type: "TEXT",
    id: "TEXT__1616157082733__13",
    position: { left: 1023, top: 413 },
    dimension: { width: "150", height: "50" },
    content: "<p>$400.00</p>"
  },
  {
    type: "TEXT",
    id: "TEXT__1616157119628__14",
    position: { left: 1023, top: 436 },
    dimension: { width: "150", height: "50" },
    content: "<p>$0</p>"
  },
  {
    type: "TEXT",
    id: "TEXT__1616157140477__15",
    position: { left: 893, top: 455 },
    dimension: { width: "190px", height: "50px" },
    content:
      '<p><strong style="background-color: rgb(0, 102, 204); color: rgb(255, 255, 255); font-size: 20px;">Grand Total:  </strong><span style="background-color: rgb(0, 102, 204); color: rgb(255, 255, 255); font-size: 20px;">$800</span></p>'
  }
];

const CanvasContainer = () => {
  const [canvasData, setCanvasData] = useState<ICanvasData[]>([]);
  const [activeSelection, setActiveSelection] = useState<Set<string>>(
    new Set()
  );
  const [enableQuillToolbar, setEnableQuillToolbar] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isSelectAll = useRef<boolean>(false);

  const updateCanvasData = (data: Partial<ICanvasComponent>) => {
    const currentDataIndex =
      canvasData.findIndex((canvas) => canvas.id === data.id) ?? -1;
    const updatedData = { ...canvasData?.[currentDataIndex], ...data };
    canvasData.splice(currentDataIndex, 1, updatedData);
    setCanvasData([...(canvasData || [])]);
  };

  const addElement = (type: string) => {
    const defaultData = getInitialData(canvasData, type);
    setCanvasData([...canvasData, { ...defaultData, type: type ?? "TEXT" }]);
    activeSelection.clear();
    activeSelection.add(defaultData.id);
    setActiveSelection(new Set(activeSelection));
  };

  const deleteElement = useCallback(() => {
    setCanvasData([
      ...canvasData.filter((data) => {
        if (data.id && activeSelection.has(data.id)) {
          activeSelection.delete(data.id);
          return false;
        }
        return true;
      })
    ]);
    setActiveSelection(new Set(activeSelection));
  }, [activeSelection, canvasData]);

  const selectAllElement = useCallback(() => {
    isSelectAll.current = true;
    canvasData.map((data) => activeSelection.add(data.id || ""));
    setActiveSelection(new Set(activeSelection));
  }, [activeSelection, canvasData]);

  const context: ICanvasContext = {
    actions: {
      setCanvasData,
      setActiveSelection,
      updateCanvasData,
      addElement,
      setEnableQuillToolbar
    },
    state: {
      canvasData,
      activeSelection,
      enableQuillToolbar
    }
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Delete") {
        deleteElement();
      } else if (["a", "A"].includes(event.key) && event.ctrlKey) {
        event.preventDefault();
        selectAllElement();
      }
    },
    [deleteElement, selectAllElement]
  );

  const outSideClickHandler = () => {
    isSelectAll.current = false;
    setActiveSelection(new Set());
  };

  const handleMouseDown = useCallback((event) => {
    if (!isSelectAll.current) {
      return;
    }

    outSideClickHandler();
    isSelectAll.current = false;
  }, []);

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [handleKeyDown, handleMouseDown]);

  return (
    <div ref={containerRef}>
      <CanvasContext.Provider value={context}>
        <Toolbar isEditEnable={enableQuillToolbar} />
        <div className="canvas-container">
          {canvasData.map((canvas) => {
            return <CanvasComponent {...canvas} />;
          })}
        </div>
        {/* {JSON.stringify(canvasData)} */}
      </CanvasContext.Provider>
    </div>
  );
};

export default CanvasContainer;
