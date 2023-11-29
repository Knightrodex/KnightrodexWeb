import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import SearchBar from '../components/SearchBar';
import Activities from "../components/Activities";
import ForgotPasswordBox from "../components/ForgotPasswordBox";
import ResetCodeBox from "../components/ResetCodeBox";
import NewPasswordBox from "../components/NewPasswordBox";




function ResetPasswordPage() {

    return (
        <>
            <ForgotPasswordBox />
            {/* <ResetCodeBox />
            <NewPasswordBox /> */}
        </>
    );
}

export default ResetPasswordPage;
