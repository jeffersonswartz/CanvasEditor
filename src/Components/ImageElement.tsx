import React, { useContext, useRef } from "react";
import { CanvasContext, ICanvasComponent } from "../CanvasContainer";

const ImageElement = (props: ICanvasComponent) => {
  const { content, id } = props;
  const { actions } = useContext(CanvasContext);
  const uploadRef = useRef<HTMLInputElement>(null);

  const getBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const getImageDimensions = async (
    file: string
  ): Promise<{ [key: string]: number }> => {
    return new Promise((resolved, rejected) => {
      var i = new Image();
      i.onload = function () {
        resolved({
          w: i.width,
          h: i.height,
          nw: i.naturalWidth,
          nh: i.naturalHeight
        });
      };
      i.src = file;
    });
  };

  const getAdjustedDimenstions = (
    width: number,
    height: number,
    resultWidth: number
  ) => {
    const ratio = width / height;
    return { calcWidth: resultWidth, calcHeight: resultWidth / ratio };
  };

  const imageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (file) {
      const base64 = (await getBase64(file)) as string;
      const imageDimensions: {
        [key: string]: number;
      } = await getImageDimensions(base64);
      const { calcWidth, calcHeight } = getAdjustedDimenstions(
        imageDimensions?.nw,
        imageDimensions?.nh,
        150
      );
      actions?.updateCanvasData({
        id,
        content: base64 || "",
        dimension: {
          width: `${calcWidth || 0}`,
          height: `${calcHeight || 0}`
        }
      });
    }
  };

  const triggerUpload = () => {
    const element = uploadRef?.current;
    if (element) {
      element.click();
    }
  };

  const renderUploadContent = () => {
    return (
      <>
        <div className="image-upload-container" onClick={triggerUpload}>
          <div>Upload Image</div>
        </div>
        <input
          ref={uploadRef}
          type="file"
          id="imageFile"
          name="imageFile"
          accept=".jpg, .png, .jpeg"
          onChange={imageUpload}
        />
      </>
    );
  };

  const renderImage = () => {
    return (
      <div
        style={{
          backgroundImage: `url(${content})`,
          backgroundSize: "contain",
          width: "100%",
          height: "100%",
          backgroundRepeat: "no-repeat"
        }}
      />
    );
  };

  return <>{!content ? renderUploadContent() : renderImage()}</>;
};

export default ImageElement;
