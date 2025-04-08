const Event = require('../models/event-model');
const { Ticket } = require('../models/ticket-model');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const fs = require("fs");
// const path = require("path");
// const nodemailer = require("nodemailer");
// const PDFDocument = require("pdfkit");
// const QRCode = require('qrcode');


const createEvent = async (req, res) => {
    try {
        const { title, description, date, venue, price, artist, category } = req.body;
        const image = req.file ? req.file.path : null;
        const organizer = req.user.user._id;
        const event = await Event.create({ title, description, date, venue, price, image, artist, organizer, category,  createdAt: new Date(), });
        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            newEvent: event
        })
    } catch (error) {
        console.error('Error creating an event:', error);
        res.status(500).json({ message: 'Error creating an event', error: error.message });
    }
};

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate("venue")
            .populate("organizer");
        res.status(200).json(events);
    } catch (error) {
        console.error("Error getting events:", error);
        res.status(500).json({ message: "Error getting events", error: error.message });
    }
};

const updateEvent = async (req, res) => {
    try {
        const newEventData = req.body;
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.eventId,
            newEventData,
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        };

        res.status(200).json({ success: true, message: "Event updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
}

const deleteEvent = async (req, res) => {
    try {
        const id = req.params.id
        await Event.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Event deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
}
const findEventById = async (req, res) => {
    try {
        const id = req.params.id
        const event = await Event.findById(id).populate("venue").populate("organizer");
        res.status(200).json({ success: true, event });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
}
const buyEventTicket = async (req, res) => {
    try {
      const { eventId } = req.body;
  
      const event = await Event.findById(eventId).populate("venue organizer");
      if (!event) return res.status(404).json({ message: "Event not found!" });
      
      const totalAmount = event.price;
      const eventImage = event.image ? `http://localhost:3000/${event.image.replace(/\\/g, "/")}` : null;
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        success_url: `http://localhost:5173/event-payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:5173/payment-failure`,
        customer_email: req.user.user.email,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Event Ticket: ${event.title}`,
                images: eventImage ? [eventImage] : [],
              },
              unit_amount: totalAmount * 100, // Stripe uses cents
            },
            quantity: 1,
          },
        ],
        metadata: {
          eventId: event._id.toString(),
          userId: req.user.user._id.toString()
        },
      })
      res.status(200).json({ success: true, url: session.url });
    } catch (error) {
      console.error("Error creating payment session:", error);
      res.status(500).json({ message: "Error creating payment session", error: error.message });
    }
  };
  
//   // Send receipt email for event payment
//   const sendEventTicketEmail = async (email, ticket) => {
//     try {
//         const ticketsDir = path.join(__dirname, "../uploads/event-tickets");

//         // Ensure the tickets folder exists
//         if (!fs.existsSync(ticketsDir)) {
//             fs.mkdirSync(ticketsDir, { recursive: true });
//         }

//         const pdfPath = path.join(ticketsDir, `ticket_${ticket._id}.pdf`);
//         const doc = new PDFDocument({
//             size: 'A4',
//             margins: { top: 50, bottom: 50, left: 50, right: 50 }
//         });

//         // Primary brand color
//         const primaryColor = '#ED4A43';

//         // Generate QR code with ticket data
//         const qrData = JSON.stringify({
//             ticketId: ticket._id,
//             eventId: ticket.event._id,
//             attendeeId: ticket.attendee._id,
//             validUntil: ticket.event.date
//         });
//         const qrCodeBuffer = await QRCode.toBuffer(qrData);

//         // Start writing to PDF
//         doc.pipe(fs.createWriteStream(pdfPath));

//         // Header with logo placeholder and title
//         doc.rect(0, 0, doc.page.width, 120).fill(primaryColor);
//         doc.fill('#FFFFFF').fontSize(24).font('Helvetica-Bold').text('EVENT TICKET', 50, 50, { align: 'center' });
//         doc.fontSize(12).text('Thank you for your purchase', { align: 'center' });

//         // Ticket details section
//         doc.fill('#000000').fontSize(14).font('Helvetica-Bold').text('TICKET DETAILS', 50, 150);
//         doc.moveTo(50, 170).lineTo(550, 170).stroke(primaryColor);

//         // Two-column layout for ticket info
//         const leftCol = 50;
//         const rightCol = 300;
//         let yPos = 190;

//         // Ticket information
//         doc.fontSize(10).font('Helvetica-Bold').text('Event:', leftCol, yPos);
//         doc.font('Helvetica').text(ticket.event.title, leftCol + 100, yPos);

//         doc.font('Helvetica-Bold').text('Ticket ID:', rightCol, yPos);
//         doc.font('Helvetica').text(ticket._id.toString(), rightCol + 100, yPos);
//         yPos += 25;

//         doc.font('Helvetica-Bold').text('Venue:', leftCol, yPos);
//         doc.font('Helvetica').text(ticket.event.venue.name, leftCol + 100, yPos);

//         doc.font('Helvetica-Bold').text('Date:', rightCol, yPos);
//         doc.font('Helvetica').text(new Date(ticket.event.date).toLocaleString(), rightCol + 100, yPos);
//         yPos += 25;

//         doc.font('Helvetica-Bold').text('Attendee:', leftCol, yPos);
//         doc.font('Helvetica').text(ticket.attendee.fullName, leftCol + 100, yPos);

//         doc.font('Helvetica-Bold').text('Purchase Date:', rightCol, yPos);
//         doc.font('Helvetica').text(new Date(ticket.paymentDate).toLocaleString(), rightCol + 100, yPos);
//         yPos += 40;

//         // Event details section
//         doc.fill('#000000').fontSize(14).font('Helvetica-Bold').text('EVENT INFORMATION', 50, yPos);
//         yPos += 20;
//         doc.moveTo(50, yPos).lineTo(550, yPos).stroke(primaryColor);
//         yPos += 20;

//         doc.fontSize(10).text(ticket.event.description, 50, yPos, { width: 500 });
//         yPos += 60;

//         // QR Code section
//         doc.fillColor('black').fontSize(12).font('Helvetica-Bold').text('SCAN FOR ENTRY', 50, yPos);
//         doc.image(qrCodeBuffer, 50, yPos + 20, { fit: [100, 100] });

//         // Terms and conditions
//         doc.fontSize(10).font('Helvetica').text('Terms and Conditions:', 200, yPos + 30);
//         doc.fontSize(8).text('1. This ticket is non-refundable', 200, yPos + 50);
//         doc.text('2. Valid only for the date and time specified', 200, yPos + 65);
//         doc.text('3. Must present valid ID matching attendee name', 200, yPos + 80);

//         // Footer
//         const footerY = doc.page.height - 50;
//         doc.fontSize(8).text('For support, contact support@example.com', 50, footerY);
//         doc.text('Generated on ' + new Date().toLocaleString(), 350, footerY);

//         doc.end();

//         // Create email transporter
//         const transporter = nodemailer.createTransport({
//             service: "Gmail",
//             auth: {
//                 user: process.env.EMAIL_USERNAME,
//                 pass: process.env.EMAIL_PASSWORD
//             }
//         });

//         // Format date and time nicely
//         const eventDate = new Date(ticket.event.date);
//         const formattedDate = eventDate.toLocaleDateString();
//         const formattedTime = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//         const mailOptions = {
//             from: process.env.EMAIL_USERNAME,
//             to: email,
//             subject: `Your Ticket for ${ticket.event.title}`,
//             text: `Thank you for purchasing a ticket for ${ticket.event.title}. Your ticket is attached.`,
//             html: `
//                 <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
//                     <div style="background-color: #ED4A43; padding: 20px; text-align: center; color: white; border-radius: 5px 5px 0 0;">
//                         <h1 style="margin: 0;">Your Event Ticket</h1>
//                     </div>
//                     <div style="padding: 20px;">
//                         <p>Dear ${ticket.attendee.fullName},</p>
//                         <p>Thank you for purchasing a ticket to <strong>${ticket.event.title}</strong>. Below are your event details:</p>
                        
//                         <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
//                             <h3 style="margin-top: 0; color: #ED4A43;">Event Information</h3>
//                             <p><strong>Date:</strong> ${formattedDate} at ${formattedTime}</p>
//                             <p><strong>Venue:</strong> ${ticket.event.venue.name}</p>
//                             <p><strong>Location:</strong> ${ticket.event.venue.address || 'N/A'}</p>
//                         </div>
                        
//                         <p>Your ticket is attached to this email as a PDF. You can either:</p>
//                         <ul>
//                             <li>Print the ticket and bring it with you</li>
//                             <li>Show the PDF on your mobile device</li>
//                         </ul>
                        
//                         <p style="font-size: 12px; color: #777;">
//                             <strong>Note:</strong> This ticket is non-transferable. Please bring a valid ID matching the attendee name.
//                         </p>
//                     </div>
//                     <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 5px 5px;">
//                         <p style="margin: 0;">This is an automated message. Please do not reply.</p>
//                     </div>
//                 </div>
//             `,
//             attachments: [{
//                 filename: `ticket_${ticket._id}.pdf`,
//                 path: pdfPath,
//                 contentType: 'application/pdf'
//             }]
//         };

//         await transporter.sendMail(mailOptions);
//         console.log(`Ticket email sent to ${email}`);
//         return true;
//     } catch (error) {
//         console.error("Error sending ticket email:", error);
//         return false;
//     }
// };
  
  // Verify payment for event
  const verifyEventPayment = async (req, res) => {
    try {
        const { session_id } = req.query;
        if (!session_id) {
            return res.status(400).json({ success: false, message: "Session ID is required" });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === "paid") {
            const eventbuying = await Event.findById(req.params.id)
            .populate("venue")
            .populate("user")
            console.log("Fetched eventbuying:", eventbuying); 

            if (!eventbuying) return res.status(404).json({ message: "Event not found!" });

            eventbuying.payment_status = "paid";
            await eventbuying.save();

           //Create Event
                 const newEvent = new Event({
                   title: eventbuying.eventDetails.title,
                   description: eventbuying.eventDetails.description,
                   date: new Date(),
                   venue: eventbuying.venue._id,
                   artist: eventbuying.eventDetails.artist,
                   organizer: eventbuying.organizer._id,
                   category: eventbuying.eventDetails.category,
                   price: eventbuying.eventDetails.ticketPrice,
                   createdAt: new Date(),
                   image: eventbuying.eventDetails.image
                 })
                 await newEvent.save(); 
                 console.log("Created newEvent:", newEvent);
                 

                  // Creating Ticket
                       const newTicket = new Ticket({
                         user: eventbuying.user._id,
                         event: eventbuying.event._id,
                         quantity: 1,
                         price: eventbuying.event.price,
                         ticketCodes: [eventbuying.ticketCode],
                        purchaseDate: new Date(),  
                       });
                       await newTicket.save();
                       console.log("Created newTicket:", newTicket);
            
        } else {
            res.json({ success: false, message: "Payment not completed" });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error verifying payment", 
            error: error.message 
        });
    }
};

module.exports = { createEvent, getAllEvents, updateEvent, deleteEvent, findEventById, buyEventTicket, verifyEventPayment };