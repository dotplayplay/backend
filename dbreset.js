const { resetCrashDB } = require("./controller/crashControllers");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const dbUri = `mongodb+srv://highscoreteh:eNiIQbm4ZMSor8VL@cluster0.xmpkpjc.mongodb.net/main_page?retryWrites=true&w=majority`;
mongoose
  .connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("Database connected");
    return resetCrashDB(); 
  })
  .catch((err) => console.log(err))
  .finally(() => process.exit(0));
