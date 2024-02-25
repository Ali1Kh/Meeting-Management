import React, { useCallback, useState } from "react";
import "./newMeeting.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import $ from "jquery";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useDropzone } from "react-dropzone";

const newTheme = (theme) =>
  createTheme({
    palette: {
      mode: "dark",
    },
  });
export default function NewMeeting() {
  let [date, setDate] = useState(null);
  let [time, setTime] = useState(null);

  let [managers, setManagers] = useState([]);
  let [allmanagers, setAllManagers] = useState([]);
  let [insidePersons, setInsidePersons] = useState([]);

  async function addMeeting() {
    let person = $("#meetPerson").val();
    let topic = $("#meetTopic").val();
    let address = $("#meetAddress").val();
    let notes = $("#meetNotes").val();
    let managerSelected = $("#managerSelected").val();
    let area = $('input[name="radio-group"]:checked').val();

    if (
      !date ||
      !time ||
      person === "" ||
      topic === "" ||
      address === "" ||
      notes === "" ||
      area === "" ||
      managerSelected === ""
    ) {
      $(".error").removeClass("d-none");
      $(".error").addClass("d-block");
      return;
    }
    let dateInput, timeInput;
    if (date) {
      dateInput = new Date(date.$d).toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }
    if (time) {
      timeInput = new Date(time.$d).toLocaleString("en-GB", {
        hour12: false,
      });
    }

    let initData = {
      date: dateInput.split(",")[0].split("/").reverse().join("-"),
      time: timeInput.split(",")[1].split(" ")[1],
      person,
      about: topic,
      address,
      notes,
      in_or_out: area,
      insidePersons,
    };

    if (area !== "Inside") {
      delete initData.insidePersons;
    }

    const flattenObject = (obj, parentKey = "") => {
      return Object.keys(obj).reduce((acc, key) => {
        const currentKey = parentKey ? `${parentKey}[${key}]` : key;
        if (typeof obj[key] === "object" && obj[key] !== null) {
          return { ...acc, ...flattenObject(obj[key], currentKey) };
        } else {
          return { ...acc, [currentKey]: obj[key] };
        }
      }, {});
    };

    const flattenedData = flattenObject(initData);
    const formData = new FormData();
    for (const [key, value] of Object.entries(flattenedData)) {
      formData.append(key, value);
    }

    formData.append("attachment", uploadedFiles[0]);

    try {
      let { data } = await axios.post(
        `https://meetingss.onrender.com/secretary/createMeeting/${managerSelected}`,
        formData,
        { headers: { token: localStorage.getItem("token") } }
      );
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getSecManagers() {
    let { data } = await axios.get(
      "https://meetingss.onrender.com/secretary/getSecManagers",
      { headers: { token: localStorage.getItem("token") } }
    );
    setManagers(data.managers);
  }

  async function getAllManagers() {
    let { data } = await axios.get(
      "https://meetingss.onrender.com/secretary/getAllManagers",
      { headers: { token: localStorage.getItem("token") } }
    );
    setAllManagers(data.managers);
  }

  useEffect(() => {
    getSecManagers();
    getAllManagers();
  }, []);

  const [buttonPressed, setButtonPressed] = useState("Inside");

  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleDrop = (acceptedFiles) => {
    setUploadedFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: { "application/pdf": [] },
    multiple: false,
  });

  const handleManagerChange = (event, value) => {
    setInsidePersons(value.map((manager) => manager.manager_id));
  };

  const [t, il8n] = useTranslation();

  return (
    <div className="main">
      <div className="container d-flex flex-column align-items-center justify-content-center p-xxl-4">
        <h2
          className="mt-4 mb-xxl-5 mb-3 BlackToWhite"
          style={{ userSelect: "none" }}
        >
          {t("CreateOrUpdateMeeting.createMeeting")}
        </h2>

        <div className="inputsContainer p-0 w-100  p-md-4 mb-0 pb-0 d-flex flex-column justify-content-center align-items gap-1">
          <div className="calenderPicker row p-0 m-0">
            <div className="col-md-6  inputItem mb-3 px-5">
              <ThemeProvider theme={newTheme}>
                <DesktopDatePicker
                  format="LL"
                  onChange={(val) => setDate(val)}
                />
              </ThemeProvider>
            </div>
            <div className="col-md-6  inputItem timePicker mb-3 px-5 ">
              <ThemeProvider theme={newTheme}>
                <TimePicker
                  onChange={(val) => setTime(val)}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                />
              </ThemeProvider>
            </div>
          </div>
          <div>
            {buttonPressed === "Inside" ? (
              <div className="inputItem mb-3 px-5">
                <Autocomplete
                  multiple
                  id="tags-filled"
                  onChange={handleManagerChange}
                  options={allmanagers}
                  getOptionLabel={(option) =>
                    option.first_name + " " + option.last_name
                  }
                  freeSolo
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        key={option.manager_id}
                        variant="outlined"
                        className="bg-info"
                        label={option.first_name + " " + option.last_name}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={t("CreateOrUpdateMeeting.person")}
                      className="tagify"
                      sx={{
                        backgroundColor: "var(--cardBgColor)",
                        padding: "8px",
                        color: "var(--BlackToWhite)",
                        border: "2px solid var(--sec-color)",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                />
              </div>
            ) : (
              <div className="inputItem mb-3 px-5 ">
                <input
                  type="text"
                  className="form-control py-2"
                  id="meetPerson"
                  placeholder={t("CreateOrUpdateMeeting.person")}
                />
              </div>
            )}
          </div>

          <div className="inputItem mb-3 px-5">
            <input
              type="text"
              className="form-control py-2"
              id="meetTopic"
              placeholder={t("CreateOrUpdateMeeting.topic")}
            />
          </div>
          <div className="inputItem mb-3 px-5">
            <input
              type="text"
              className="form-control py-2"
              id="meetAddress"
              placeholder={t("CreateOrUpdateMeeting.address")}
            />
          </div>
          <div className="inputItem mb-3 px-5">
            <textarea
              className="form-control py-2"
              id="meetNotes"
              rows="4"
              style={{ maxHeight: "150px" }}
              placeholder={t("CreateOrUpdateMeeting.notes")}
            ></textarea>
          </div>
          <div className="inputItem  mb-3 px-5 ">
            <div className="upload-container">
              <div
                {...getRootProps()}
                style={{ borderStyle: "dashed" }}
                className={`dropzone h-100 ${
                  isDragActive ? "active h-100" : ""
                }`}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the file here</p>
                ) : (
                  <div className="d-flex justify-content-center align-items-center flex-column">
                    <img
                      width={"60px"}
                      height={"60px"}
                      src={require("../../../../image/cloud-upload-regular-240.png")}
                      alt=""
                      srcset=""
                    />
                    <p className="p-2 text-center">
                      Drag and drop file here or click to browse
                    </p>
                  </div>
                )}
              </div>

              <div className="file-list mt-3">
                {uploadedFiles.length > 0 ? (
                  <div className="d-flex flex-row flex-wrap gap-3">
                    {uploadedFiles.map((file, index) => (
                      <div
                        className="cursorPointer w-fit p-3 py-2 rounded-3 position-relative"
                        key={index}
                        style={{
                          border: "1px solid var(--cardHeadingColor)",
                        }}
                      >
                        <i className="fa-solid fa-file-pdf"></i>{" "}
                        <span>{file.name}</span>
                        <div
                          onClick={(e) => {
                            setUploadedFiles(
                              uploadedFiles.filter(
                                (fileItem) => fileItem.path != file.path
                              )
                            );
                          }}
                          className="deleteFile cursorPointer position-absolute"
                          style={{ top: "-10px", right: "-10px" }}
                        >
                          <i className="fa-regular fa-trash-can"></i>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No file uploaded</p>
                )}
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <div className="inputItem mb-3 px-5 ">
              <select id="managerSelected" className="py-2 w-auto px-2">
                <option value="">Choose Manager</option>
                {managers?.map((manager) => (
                  <>
                    <option value={manager.manager_id}>
                      {manager.first_name} {manager.last_name}
                    </option>
                  </>
                ))}
              </select>

              {/* <Button
                className="btn btn-primary m-3 mb-4"
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
              >
                Upload file
                <VisuallyHiddenInput type="file" />
              </Button> */}
            </div>
            <div className="radios inputItem mb-3 px-5 d-flex gap-3 align-items-center">
              <div className="radio-buttons-container ">
                <div className="radio-button d-flex align-items-center">
                  <input
                    name="radio-group"
                    id="radio2"
                    className="radio-button__input"
                    type="radio"
                    value={"Inside"}
                    onClick={() => {
                      setButtonPressed("Inside");
                    }}
                  />
                  <label
                    htmlFor="radio2"
                    className="radio-button__label BlackToWhite"
                  >
                    <span className="radio-button__custom"></span>
                    {t("CreateOrUpdateMeeting.inside")}
                  </label>
                </div>
                <div className="radio-button d-flex align-items-center">
                  <input
                    name="radio-group"
                    id="radio1"
                    className="radio-button__input"
                    type="radio"
                    value={"Outside"}
                    onClick={() => {
                      setButtonPressed("Outside");
                    }}
                  />
                  <label
                    htmlFor="radio1"
                    className="radio-button__label BlackToWhite"
                  >
                    <span className="radio-button__custom"></span>
                    {t("CreateOrUpdateMeeting.outside")}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column w-100 justify-content-center align-items-center ">
            <small style={{ color: "red" }} className="error d-none mb-3">
              All Inputs Are Required!
            </small>

            <button onClick={addMeeting} className="addButton">
              {t("CreateOrUpdateMeeting.buttonAdd")}
            </button>
          </div>
        </div>
      </div>

      <Helmet>
        <title>Add Meeting</title>
      </Helmet>
    </div>
  );
}