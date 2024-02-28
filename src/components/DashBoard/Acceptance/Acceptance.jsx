import React, { useState } from "react";
import "./Acceptance.css";
import toast from "react-hot-toast";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
import { useQuery } from "react-query";
import { useTranslation } from "react-i18next";


const Acceptance = () => {
    const token = localStorage.getItem("token");

    let [data, setData] = useState([]);

    const getNotAcceptedAccounts = async () => {
        try {
            const response = await axios.get(
                "https://meetingss.onrender.com/dashboard/getNotAcceptedSec",
                {
                    headers: {
                        token: token,
                    },
                }
            );
            setData(response.data);
            return response.data;
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const { isLoading } = useQuery("getAcceptAccount", getNotAcceptedAccounts);

    async function acceptAccount(id) {
        try {
            const response = await axios.post(
                `https://meetingss.onrender.com/dashboard/acceptAcc/${id}`,
                {},
                {
                    headers: {
                        token: token,
                    },
                }
            );
            if (response.data.success) {
                toast.success("Accepted");
                getNotAcceptedAccounts();
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const rejectAccount = async (id) => {
        try {
            const response = await axios.post(
                `https://meetingss.onrender.com/dashboard/rejectAcc/${id}`,
                {},
                {
                    headers: {
                        token: token,
                    },
                }
            );
            console.log(response);

            if (response.data.success) {
                toast.success("Removed");
                getNotAcceptedAccounts();
            } else {
                // Handle failure
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const [t, il8n] = useTranslation();

    return (
        <>
            <div className="main">
                <div className="container mt-5">
                    <h1 className="container d-flex flex-column align-items-center justify-content-center p-4 fw-bold text-white">
                    {t("Dashborad.Acceptacne.AcceptacneName")}
                    </h1>
                    {isLoading ? (
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{ height: "65vh" }}
                        >
                            <TailSpin
                                visible={true}
                                height="90"
                                width="90"
                                color="var(--sec-color)"
                                ariaLabel="tail-spin-loading"
                                radius="1"
                                wrapperStyle={{}}
                                wrapperClass=""
                            />
                        </div>
                    ) : (
                        <div>
                            <div className="row header-table justify-content-center">
                                <div className="col">
                                    <h6>{t("Dashborad.Acceptacne.userName")}</h6>
                                </div>
                                <div className="col">
                                    <h6>{t("Dashborad.Acceptacne.name")}</h6>
                                </div>
                                <div className="col">
                                    <h6>{t("Dashborad.Acceptacne.E_mail")}</h6>
                                </div>
                                <div className="col">
                                    <h6>{t("Dashborad.Acceptacne.action")}</h6>
                                </div>
                            </div>
                            <div className="row justify-content-center">
                                {data
                                    ? data.secertaries?.map((secretary, idx) => (
                                        <div
                                            key={idx}
                                            className="row table justify-content-center"
                                        >
                                            <div className="col">{secretary.UserName}</div>
                                            <div className="col">
                                                {secretary.first_name + " " + secretary.last_name}
                                            </div>
                                            <div className="col">{secretary.E_mail}</div>
                                            <div className="col-4">
                                                <i
                                                    className="fa-solid fa-trash deletAcc"
                                                    onClick={() => {
                                                        rejectAccount(secretary.secretary_id);
                                                    }}
                                                ></i>
                                                <button
                                                    className="btn accept-button"
                                                    onClick={() => {
                                                        acceptAccount(secretary.secretary_id);
                                                    }}
                                                >
                                                    {t("Dashborad.Acceptacne.acceptBtn")}
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                    : ""}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Acceptance;