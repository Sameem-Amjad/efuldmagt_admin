// You can place this SVG in a component that's rendered once, such as your main App component or Layout
const ClipPathSVG = () => (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
            <clipPath id="inward-rounded">
                <path d="M0,15 Q15,15 15,0 H85 Q85,15 100,15 V85 Q85,85 85,100 H15 Q15,85 0,85 Z" />
            </clipPath>
        </defs>
    </svg>
);

export default ClipPathSVG;
