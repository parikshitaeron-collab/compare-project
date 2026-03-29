export default function ErrorBar() {
  return (
    <div className="error-bar" id="errBar" hidden>
      <span>⚠</span>
      <span id="errMsg">Something went wrong.</span>
      <button className="error-bar-close" id="errClose" type="button">
        ✕
      </button>
    </div>
  );
}
