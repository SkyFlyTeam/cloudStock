import React from "react";

function LoadingDots({ data }: { data: any[] }) {
    return data.length === 0 ? (
        <center><div className="loader"></div></center>
    ) : null;
}

export { LoadingDots };
