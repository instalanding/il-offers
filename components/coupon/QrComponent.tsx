import React from 'react'
import QRCode from "react-qr-code";

const QrComponent = ({redirectUrl}:any) => {
    return (
        <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%", padding: '8px' }}
            value={redirectUrl}
            viewBox={`0 0 256 256`}
        />
    )
}

export default QrComponent