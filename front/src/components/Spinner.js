// src/components/Spinner.jsx
export default function Spinner({size=20, className=""}){
  return <div className={`spinner ${className}`} style={{width:size, height:size}} aria-hidden="true" />;
}
