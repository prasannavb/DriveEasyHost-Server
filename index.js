//Neccesary imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//Firebase
const firebase = require('./firebase');
const { getAuth } = require('firebase-admin/auth');
const { async } = require('@firebase/util');
const auth = getAuth(firebase);
const { start } = require('repl');

//Models
const {CarModel} =require("./Models/CarModel")
const {SellerModel} = require('./Models/SellerModel')
const {BookingModel}=require("./Models/BookingModel")
const {PastBookingModel}=require("./Models/PastBookingModel");
const { CarMetaData } = require('./Models/CarMetaData');
const { ReviewModel } = require('./Models/ReviewModel');
const {UserModel}=require('./Models/UserModel')

//Functions
const xlsx=require('xlsx');
const {transporter}=require('./Mail/Sendmail')

//ENV
require('dotenv').config()

const DATABASE_URL=process.env.DATABASE_URL
const app = express();
app.use(cors());
app.use(express.json());

    mongoose.connect(DATABASE_URL)
    .then(()=>
    {
        app.listen(9000,()=>{
            
        console.log("Server connected")
        console.log("Running at 8000")
        })
    }).catch()
    {
        console.log("error") 
    } 

//Create New user

  app.post("/CreateUser",async(req,res)=>
  {
    const {name,email,password,phone,location}=req.body
    try
    {
      const sellerDetails=await SellerModel.find({phone})
      if(sellerDetails.length>0)
      {
        res.send({status:"The phone number you entered is already registered",action:false})
      }
      else
      {
        const acc = await auth.createUser({email,password});
        const sid = acc.sid;
        await SellerModel.insertMany({sid:String(sid),name:name.charAt(0).toUpperCase()+name.slice(1),email:email,password:password,phone:phone,location:location.charAt(0).toUpperCase()+location.slice(1),gender:'',address:''})
        res.send({status:"Profile Created Successfully",action:true})  
      }
      }
    catch(err)
    {
      res.send({status:"The email address you provided is already registered",action:false})
    }
  })


// Login
app.post("/findUser",async(req,res)=>{
    const {sid}=req.body
    try
    {
      const response=await SellerModel.findOne({sid})
      res.json(response)
    }
    catch(err)
    {
      console.log("Invalid Email")
    }
})

//Add cars
app.post("/AddCars",async(req,res)=>
{
    const { sid,car_no,img,name,year,fuel,make,model,type,price,location}=req.body
    const data=await CarModel.find({car_no})
    if(data.length>0)
    {
      res.send({status:"Car already registered",action:false})
    }
    else
    {
      await CarModel.insertMany({sid:sid,car_no:car_no,img:img,name:name.charAt(0).toUpperCase()+name.slice(1),year:year,fuel:fuel,make:make.charAt(0).toUpperCase()+make.slice(1),model:model.charAt(0).toUpperCase()+model.slice(1),type:type.charAt(0).toUpperCase()+type.slice(1),price:price,ratings:"0",location:location.charAt(0).toUpperCase()+location.slice(1),list_start:"--",list_drop:"--",isverified:false})
      res.send({status:"Successfully registered",action:true})
    }
})

//VerifiedCars
app.post("/VerifiedCars", async (req, res) => {
    const { sid } = req.body;
    CarModel.aggregate([
      {
        $match:{
          $and:[
            {
              sid:sid
            },
            {
              isverified:true
            }
          ]
        }
      },
    ])
      .then((result) => {
        res.send(result)
    })
    .catch((error) => {
      console.error(error);
    });

});

//UnVerifiedCars
app.post("/UnVerifiedCars", async (req, res) => {
  const { sid } = req.body;
  CarModel.aggregate([
    {
      $match:{
        $and:[
          {
            sid:sid
          },
          {
            isverified:false
          }
        ]
      }
    },
  ])
    .then((result) => {
      res.send(result)
  })
  .catch((error) => {
    console.error(error);
  });

});

//EditCarDetails
app.put("/EditCarDetails",async(req,res)=>{
    const {car_no,price,location,list_start,list_drop}=req.body
    const bookingDetails=await BookingModel.find({car_no})
    if(bookingDetails.length>0)
    {
      res.send({status:"The car is booked out and cannot edit now.",action:false})
    }
    else
    {
      await CarModel.updateOne({car_no:car_no},
        {$set:{
            price:price,
            location:location,
            list_start:list_start,
            list_drop:list_drop,
        }})
res.send({action:true})
    }
})

//DelteCarDetail
app.delete("/DeleteCarDetail",async(req,res)=>{
const {car_no}=req.body;
const bookingDetails=await BookingModel.find({car_no})
if(bookingDetails.length>0)
{
  res.send({status:"The car is reserved and cannot be removed at this time",action:false})
}
else
{
  await CarModel.deleteOne({car_no:car_no})
  res.send({status:"Success",action:true})
}
}) 
 

//ActiveBookings
app.post("/ActiveBookings",async(req,res)=>{
  const {sid}=req.body;
BookingModel.aggregate([
{
  $match: {
  sid: sid
  }
},
{
  $lookup: {
    from: 'userdetails',
    localField: 'uid',
    foreignField: 'uid',
    as: 'userdetails',
  },
},

{
  $lookup: {
      from: "cardetails",
      localField: "car_no",
      foreignField: "car_no",
      as: "cardetails"
  }
},
{
  $unwind: "$cardetails"
},
{
  $unwind: "$userdetails",
},
{
  $project: {
    _id: 1,
    'bookingDetails.sid': '$$ROOT.sid',
    'bookingDetails.uid': '$$ROOT.uid',
    'bookingDetails.car_no': '$$ROOT.car_no',
    'bookingDetails.sid': '$$ROOT.sid',
    'bookingDetails.start_date': '$$ROOT.start_date',
    'bookingDetails.drop_date': '$$ROOT.drop_date',
    'bookingDetails.amount': '$$ROOT.amount',
    'userdetails.name': 1,
    'userdetails.phone': 1,
    'cardetails.name':1,
    'cardetails.img':1,
    'cardetails.fuel':1,
    'cardetails.make':1,
    'cardetails.model':1,
    'cardetails.type':1,
    'cardetails.location':1,
    'cardetails.year':1,
    'cardetails.price':1,
  },
},
])
.then((result) => {
    res.send(result)
})
.catch((error) => {
  console.error(error);
});
})  

//PastBookings 
app.post("/PastBookings",async(req,res)=>{
  const {sid}=req.body
  PastBookingModel.aggregate([
    {
        $match:{
            sid:sid
        }
    },
    {
      $lookup: {
        from: 'userdetails',
        localField: 'uid',
        foreignField: 'uid',
        as: 'userdetails',
      },
    },
  
    {
      $lookup: {
          from: "cardetails",
          localField: "car_no",
          foreignField: "car_no",
          as: "cardetails"
      }
  },
  {
      $unwind: "$cardetails"
  },
  {
      $unwind: "$userdetails",
    },
    {
        $project:{
            _id:1,
            'bookingDetails.sid': '$$ROOT.sid',
            'bookingDetails.car_no': '$$ROOT.car_no',
            'bookingDetails.uid': '$$ROOT.uid',
            'bookingDetails.uid': '$$ROOT.uid',
            'bookingDetails.start_date': '$$ROOT.start_date',
            'bookingDetails.drop_date': '$$ROOT.drop_date',
            'bookingDetails.amount': '$$ROOT.amount',
            'userdetails.name': 1,
            'userdetails.phone': 1,
            'cardetails.name':1,
            'cardetails.img':1,
            'cardetails.fuel':1,
            'cardetails.make':1,
            'cardetails.model':1,
            'cardetails.type':1,
            'cardetails.location':1,
            'cardetails.year':1,
            'cardetails.price':1,
        }
    }
  
  ])
  .then(result => {
    res.send(result)
  })
  .catch(error => {
    res.send({status:"Error"})
  });
  })


//Select types
app.get("/InputDetails",async(req,res)=>{
  const data=await CarMetaData.find({})
  res.json(data[0])

})

//BookingList
app.post('/BookingList',async(req,res)=>
{
    const {sid}=req.body
    const ActiveBookings=await BookingModel.aggregate([
      {
        $match:{
          sid:sid
        }
      },
      {
        $lookup:
        {
          from:'userdetails',
          localField:'uid',
          foreignField:'uid',
          as:'userdetails'
        },
      },
      {
        $lookup:
        {
          from:'cardetails',
          localField:'car_no',
          foreignField:'car_no',
          as:'cardetails'
        }, 
      },
      {
        $unwind: "$cardetails"
    },
    {
        $unwind: "$userdetails",
      },
      {
        $project: {
          _id: 1,
          'bookingDetails.car_no': '$$ROOT.car_no',
          'bookingDetails.start_date': '$$ROOT.start_date',
          'bookingDetails.drop_date': '$$ROOT.drop_date',
          'bookingDetails.amount': '$$ROOT.amount',
          'userdetails.name': 1,
          'userdetails.phone': 1,
          'cardetails.ratings':1,
        },
      },
    ])

    const PastBookings=await PastBookingModel.aggregate([
      {
        $match:{
          sid:sid
        }
      },
      {
        $lookup:
        {
          from:'userdetails',
          localField:'uid',
          foreignField:'uid',
          as:'userdetails'
        },
      },
      {
        $lookup:
        {
          from:'cardetails',
          localField:'car_no',
          foreignField:'car_no',
          as:'cardetails'
        }, 
      },
      {
        $unwind: "$cardetails"
    },
    {
        $unwind: "$userdetails",
      },
      {
        $project: {
          _id: 1,
          'bookingDetails.car_no': '$$ROOT.car_no',
          'bookingDetails.start_date': '$$ROOT.start_date',
          'bookingDetails.drop_date': '$$ROOT.drop_date',
          'bookingDetails.amount': '$$ROOT.amount',
          'userdetails.name': 1,
          'userdetails.phone': 1,
          'cardetails.ratings':1,
        },
      },
    ])
    const TotalBookings=[...ActiveBookings,...PastBookings]
    res.send(TotalBookings) 
})

//UserCarsCount
app.post('/UserCarsCount',async(req,res)=>
{
  const {sid}=req.body
  const carcount=await CarModel.find({sid:sid}).count()
  const verifycarcount=await CarModel.find({sid:sid,isverified:true}).count()   

  const Pastsum = await PastBookingModel.aggregate([
    {
      $match:
      {
        sid:sid
      }
    },
    {
      $group: {
        _id: null,
        sum_val: {
          $sum: {
            $convert: {
              input: "$amount",
              to: "decimal",
              onError: 0,  
              onNull: 0   
            }
          }
        }
      }
    }
  ]);
  const Activesum = await BookingModel.aggregate([
    {
      $match:
      {
        sid:sid
      }
    },
    {
      $group: {
        _id: null,
        sum_val: {
          $sum: {
            $convert: {
              input: "$amount",
              to: "decimal",
              onError: 0, 
              onNull: 0   
            }
          }
        }
      }
    }
  ]);

  const ActiveCars=await BookingModel.find({sid:sid}).select({start_date:1,drop_date:1})
  var activeSumValue = Activesum[0] && Activesum[0].sum_val !== undefined ? Number(Activesum[0].sum_val) : 0;
  var pastSumValue = Pastsum[0] && Pastsum[0].sum_val !== undefined ? Number(Pastsum[0].sum_val) : 0;
  
  var TotalSum = activeSumValue + pastSumValue;
  
  res.send({carcount:carcount,verifycarcount:verifycarcount,TotalSum:TotalSum,ActiveCars:ActiveCars.length})


})

//CancelTrip
app.post('/CancelTrip',async(req,res)=>
{
    const {sid,uid,car_no,start_date,drop_date,amount}=req.body
    const data=await BookingModel.deleteOne({sid:sid,uid:uid,car_no:car_no,start_date:start_date,drop_date:drop_date,amount:amount})
    const userdetails=await UserModel.findOne({uid:uid}).select({email:1,name:1})
    var mailOptions = {
      from: 'prasannavb04@gmail.com',
      to: userdetails.email,
      subject: 'Booking Cancellation Notification',
      html: `
      <div class="container">
      <p>Dear ${userdetails.name},</p>

      <p>We wanted to inform you that a booking for the car you reserved has been canceled by the host. Here are the details:</p>

      <p>The host has canceled your reservation, and we wanted to keep you informed. If you have any questions or concerns, please don't hesitate to contact our support team.</p>

      <p>We appreciate your cooperation and understanding.</p>

  <p>Best regards,<br>
  DriveEasy<br>
  prasannavb04@gmail.com<br>
</div>
      `,
  };

  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
  });

    if(data===null || data===undefined)
    {
      res.send({status:'Something went Wrong! Try again later',action:false})
    }
    else
    {
      res.send({status:'The Customer Trip has been cancelled',action:true})
    }
 
})

//File
app.get('/getFile', async (req, res) => {
  try {
    const url = 'https://firebasestorage.googleapis.com/v0/b/car-rental-9b4a5.appspot.com/o/MapLocation%2Fmaps.xlsx?alt=media&token=a38a5cf8-9e8d-4523-a333-6d7a0239de75';
    const response = await fetch(url);
    const data = await response.arrayBuffer();
    const workbook = xlsx.read(new Uint8Array(data), { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const parsedData = xlsx.utils.sheet_to_json(sheet);      
    res.send(parsedData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
  
});

//FindNameandEmail
app.post('/FindNameandEmail',async(req,res)=>{
  const {sid}=req.body
  const detail=await SellerModel.findOne({sid:sid}).select({name:1,email:1})
  res.send(detail)
})

//Contact

app.post('/ContactUs',async(req,res)=>
{   
    const {sid,Message}=req.body
    const {email}=await SellerModel.findOne({sid:sid}).select({email:1})
  
    var mailOptions = {
        from: email,
        to:'prasannavb04@gmail.com' ,
        subject: 'Priority Support Request',
        text:Message
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    res.send({action:true})
})

//findUserProfile
  app.post('/findUserProfile',async(req,res)=>{
    const {sid}=req.body
    const ProfileDetails=await SellerModel.findOne({sid})
    res.send(ProfileDetails)
  })

  //UpdateProfileDetails
  app.post('/UpdateProfileDetails',async(req,res)=>
  {
    const {sid,name,gender,email,phone,location,address}=req.body
    if(gender==='' && address==='')
    {
        await SellerModel.updateOne({sid:sid},{$set:{
            location:location,
            phone:phone
        }})

    }
    else if(address==='')
    {
        await SellerModel.updateOne({sid:sid},{$set:{
            location:location,
            phone:phone,
            gender:gender
        }})

    }
    else if(gender==='')
    {
        await SellerModel.updateOne({sid:sid},{$set:{
        location:location,
        phone:phone,
        address:address
    }})
        
    }
    else  
    {await SellerModel.updateOne({sid:sid},{$set:{
        location:location,
        phone:phone,
        gender:gender,
        address:address
    }}) 
}
  res.send({action:true})
})

//ForgotPassword
app.post('/forgotPassword',async(req,res)=>
{ 
  const {Email,Password}=req.body
  await SellerModel.updateOne({email:Email},{$set:{password:Password}})
  res.send({action:true})
})

//FindReviews
app.post('/findReviews',async(req,res)=>
{
  const {car_no}=req.body
  const reviews=await ReviewModel.find({car_no:car_no}).select({_id:1,car_review:1,car_rating:1})
  if(reviews.length>0)
  {
    res.send({reviews,action:true})
  }
  else
  {
    res.send({action:false})
  }
})

//Bookings each month
app.post('/BookingsPerMonth',async(req,res)=>
{
  const {sid}=req.body
  const ActiveBookings=await BookingModel.find({sid:sid}).select({_id:1,start_date:1,drop_date:1,amount:1})
  const PastBooking=await PastBookingModel.find({sid:sid}).count()
  res.send({PastBooking,ActiveBookings})
})