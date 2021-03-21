const Handles = (props: { show: boolean }) => {
  if (!props.show) {
    return null;
  }
  return (
    <>
      {/* Corner Handles */}
      <div className="handle left-handle top-handle"></div>
      <div className="handle left-handle bottom-handle"></div>
      <div className="handle right-handle top-handle"></div>
      <div className="handle right-handle bottom-handle"></div>

      {/* Middle Handles */}
      <div className="handle long-handle left-handle"></div>
      <div className="handle long-handle right-handle"></div>
      <div className="handle long-handle-horizontal top-handle"></div>
      <div className="handle long-handle-horizontal bottom-handle"></div>
    </>
  );
};

export default Handles;
