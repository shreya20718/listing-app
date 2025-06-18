const mongoose=require("mongoose");
const initdata=require("./data.js");
const listing=require("../models/listing.js");

main().then(()=>{
    console.log("connected to mongo");
})
.catch(err => console.log(err));


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wandurlust');
}

const initDB = async () => {
  try {
    await listing.deleteMany({});

    // Add a valid ObjectId to each object
    const updatedData = initdata.data.map((obj) => ({
    ...obj,owner:"6849563c4825014a76619e6a",
    }))
     await listing.insertMany(updatedData);
    console.log("Data inserted successfully.");
  } catch (err) {
    console.error("Error inserting data:", err);
  }
};
 

initDB();