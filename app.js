const http = require("http");
const hostname = "0.0.0.0";


const express = require("express");
const fs = require("fs");
const axios = require("axios");
const multer = require("multer");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

app.use("/assests", express.static("assets"));
app.use(
    "/assets",
    express.static(path.join(__dirname, "/assets"))
);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Configure multer for handling file uploads
const upload = multer({ dest: "uploads/" }); // Specify the destination directory for uploaded files

// Render the upload form
app.get("/", (req, res) => {
    res.render("index");
});

// Handle the image upload and detection
app.post("/upload", upload.single("image"), (req, res) => {
    try {
        // Read the uploaded image file
        const image = fs.readFileSync(req.file.path, { encoding: "base64" });

        const name = req.body.name;
        // Make the Axios request to the detection API
        axios({
            method: "POST",
            url: "https://detect.roboflow.com/rbc-detection-using-yolov5/2",
            params: {
                api_key: "l4dsTWEEZf3eaXZqC1jQ"
            },
            data: image,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then(function (response) {

                // let datat = response.data.predictions;
                // console.log("result=============");
                // console.log(datat);
                // const numberOfObjects = datat.length;

                // console.log("Number of objects:", numberOfObjects);

                // res.render("result", { counts: numberOfObjects });



                let datat = response.data.predictions;

                const numberOfObjects = datat.length;





                // Initialize class counts as zero
                let rbcCount = 0;
                let wbcCount = 0;
                let plateletsCount = 0;

                // Count objects for each class
                datat.forEach(prediction => {
                    switch (prediction.class) {
                        case 'RBC':
                            rbcCount++;
                            break;
                        case 'WBC':
                            wbcCount++;
                            break;
                        case 'Platelets':
                            plateletsCount++;
                            break;
                    }
                });

                console.log("Number of RBCs:", rbcCount);
                console.log("Number of WBCs:", wbcCount);
                console.log("Number of Platelets:", plateletsCount);

                res.render("result", { counts: numberOfObjects, rbcCount, wbcCount, plateletsCount, name });

            })
            .catch(function (error) {
                console.log(error.message);
                res.render("error");
            });
    } catch (err) {
        console.error(err);
        res.render("error");
    }
});

app.listen(process.env.PORT || 8000, function (req, res) {
    console.log("MAIN UI: http://localhost:8000/");
});

