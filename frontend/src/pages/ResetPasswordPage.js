import React, { useState } from "react";
import ForgotPasswordBox from "../components/ForgotPasswordBox";
import ResetCodeBox from "../components/ResetCodeBox";
import NewPasswordBox from "../components/NewPasswordBox";

function ResetPasswordPage() {
    const [showForgotPasswordBox, setShowForgotPasswordBox] = useState(true);
    const [showResetCodeBox, setShowResetCodeBox] = useState(false);
    const [showNewPasswordBox, setShowNewPasswordBox] = useState(false);

    const validEmailFound = () => {
        setShowForgotPasswordBox(false);
        setShowResetCodeBox(true);
    };

    const handleResetCodeSuccess = () => {
        setShowResetCodeBox(false);
        setShowNewPasswordBox(true);
    };

    return (
        <>
            {showForgotPasswordBox && (
                <ForgotPasswordBox onSuccess={validEmailFound} />
            )}
            {showResetCodeBox && (
                <ResetCodeBox onSuccess={handleResetCodeSuccess} />
            )}
            {showNewPasswordBox && <NewPasswordBox />}
        </>
    );
}

export default ResetPasswordPage;
