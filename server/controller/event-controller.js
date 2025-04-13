const Event = require('../models/event-model');
const User = require('../models/user-model');
const { Ticket } = require('../models/ticket-model');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const QRCode = require('qrcode');


const createEvent = async (req, res) => {
    try {
        const { title, description, date, venue, price, artist, category } = req.body;
        const image = req.file ? req.file.path : null;
        const organizer = req.user.user._id;
        const event = await Event.create({ title, description, date, venue, price, image, artist, organizer, category, createdAt: new Date(), });
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
        const event = await Event.findById(eventId)
            .populate("venue")
            .populate("organizer");
            
        if (!event) {
            return res.status(404).json({ 
                success: false,
                message: "Event not found!" 
            });
        }

        const totalAmount = event.price;
        const eventImage = event.image ? `http://localhost:3000/${event.image.replace(/\\/g, "/")}` : null;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `http://localhost:5173/event-payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:5173/event-payment-failure`,
            customer_email: req.user.user.email,
            line_items: [{
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: `Event Ticket: ${event.title}`,
                        images: eventImage ? [eventImage] : [],
                    },
                    unit_amount: totalAmount * 100,
                },
                quantity: 1,
            }],
            metadata: {
                eventId: event._id.toString(),
                userId: req.user.user._id.toString()
            },
        });
        
        res.status(200).json({ 
            success: true, 
            url: session.url 
        });
    } catch (error) {
        console.error("Error creating payment session:", error);
        res.status(500).json({ 
            success: false,
            message: "Error creating payment session", 
            error: error.message 
        });
    }
};

// Send receipt email for event payment
const sendEventTicketEmail = async (email, ticket) => {
    try {
        const ticketsDir = path.join(__dirname, "../uploads/event-tickets");

        // Ensure the tickets folder exists
        if (!fs.existsSync(ticketsDir)) {
            fs.mkdirSync(ticketsDir, { recursive: true });
        }

        const pdfPath = path.join(ticketsDir, `ticket_${ticket._id}.pdf`);
        const primaryColor = '#ED4A43';

        // Generating QR code with ticket data
        const qrData = JSON.stringify({
            ticketId: ticket._id,
            ticketCode: ticket.ticketCodes,
            eventName: ticket.event.title,
            venueId: ticket.event.venue._id, 
            attendeeName: ticket.user.fullName,
            ticketPrice: ticket.event.price,
            purchaseDate: ticket.purchaseDate.toISOString(),
        });
        
        // Create branded QR code with NepaEvents initials
        const qrCodeOptions = {
            errorCorrectionLevel: 'H', // High error correction allows for logo overlay
            margin: 1,
            color: {
                dark: '#000000', // QR code color matching brand
                light: '#FFFFFF' // Background color
            }
        };
        
        // Generate the QR code as an image
        const qrCodeBuffer = await QRCode.toBuffer(qrData, qrCodeOptions);
        
        // Create a canvas to overlay NepaEvents initials on the QR code
        const { createCanvas, loadImage } = require('canvas');
        const canvas = createCanvas(300, 300); // Size of the canvas
        const ctx = canvas.getContext('2d');
        
        // Draw the QR code on the canvas
        const qrImage = await loadImage(qrCodeBuffer);
        ctx.drawImage(qrImage, 0, 0, 300, 300);
        
        // Add NepaEvents initials in the center
        ctx.fillStyle = '#FFFFFF'; // White background for the text area
        ctx.fillRect(115, 130, 70, 40); // Create a white rectangle in the middle
        
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('NE', 150, 150); // NE for NepaEvents initials
        
        // Convert canvas to buffer
        const brandedQRBuffer = canvas.toBuffer('image/png');

        const doc = new PDFDocument({
            size: 'A4',
            margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });
        // Start writing to PDF
        doc.pipe(fs.createWriteStream(pdfPath));

        // Add header with logo placeholder
        doc.fontSize(24)
           .fillColor(primaryColor)
           .font('Helvetica-Bold')
           .text('EVENT TICKET', { align: 'center' });
        
        // Add a horizontal line
        doc.moveTo(50, 100)
           .lineTo(545, 100)
           .strokeColor(primaryColor)
           .lineWidth(2)
           .stroke();
        
        // Add event title
        doc.moveDown()
           .fontSize(20)
           .fillColor('#000')
           .font('Helvetica-Bold')
           .text(ticket.event.title, { align: 'center' });
        
        // Format date nicely
        const eventDate = new Date(ticket.event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const formattedTime = eventDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Event details section
        doc.moveDown(0.5)
           .fontSize(12)
           .font('Helvetica')
           .text(`Date: ${formattedDate}`, { align: 'center' })
           .text(`Time: ${formattedTime}`, { align: 'center' });
            
        // Location details
        doc.moveDown(0.5)
           .fontSize(14)
           .font('Helvetica-Bold')
           .text('Location', { align: 'center' })
           .fontSize(12)
           .font('Helvetica')
           .text(ticket.event.venue.name, { align: 'center' })
           .text(ticket.event.venue.address, { align: 'center' });
        
        // Create a tear-off line
        doc.moveDown(1)
           .lineCap('round')
           .dash(5, { space: 10 })
           .moveTo(50, doc.y)
           .lineTo(545, doc.y)
           .stroke();
        
        // Reset line style
        doc.undash();

        // Add attendee info
        doc.moveDown(1)
           .fontSize(14)
           .font('Helvetica-Bold')
           .text('Attendee Information', { continued: false });
           
        doc.fontSize(12)
           .font('Helvetica')
           .text(`Name: ${ticket.user.fullName}`)
           .text(`Email: ${email}`)
           .text(`Ticket ID: ${ticket._id}`)
           .text(`Purchase Date: ${new Date(ticket.purchaseDate).toLocaleDateString()}`);
        
        // Create a box for the QR code - centered properly
        const pageWidth = doc.page.width - 100; 
        const qrCodeSize = 130;
        const qrCodeX = (pageWidth / 2) + 50; 
        const qrCodeY = doc.y + 60; // Position with good spacing after attendee info
        
        // Add price - directly above the QR code
        doc.fontSize(12)
           .font('Helvetica-Bold')
           .text(`Price: $${parseFloat(ticket.event.price).toFixed(2)}`, 
                 qrCodeX - 40, qrCodeY - 25, 
                 { align: 'right' });
        
        // Draw QR code border
        doc.rect(qrCodeX - qrCodeSize/2 - 5, qrCodeY, qrCodeSize + 10, qrCodeSize + 10)
           .strokeColor(primaryColor)
           .lineWidth(1)
           .stroke();
        
        // Add branded QR code
        doc.image(brandedQRBuffer, qrCodeX - qrCodeSize/2, qrCodeY + 5, { 
            fit: [qrCodeSize, qrCodeSize]
        });

        // Add scan instructions below QR code
        doc.fontSize(10)
           .text('Scan this QR code at the event entrance', 
                 qrCodeX - qrCodeSize, qrCodeY + qrCodeSize + 15, 
                 { width: qrCodeSize * 2, align: 'center' });
        
        // Calculate the y position after QR code for instructions
        const instructionsY = qrCodeY + qrCodeSize + 50;
        
        // Add ticket instructions
        doc.fontSize(12)
           .fillColor('#555')
           .text('Instructions:', 50, instructionsY, { continued: false })
           .fontSize(10)
           .text('1. Please bring a printed copy of this ticket or show it on your mobile device.', { indent: 10 })
           .text('2. Arrive at least 30 minutes before the event starts.', { indent: 10 })
           .text('3. This ticket is valid for one-time entry only.', { indent: 10 })
           .text('4. Please follow venue guidelines regarding prohibited items.', { indent: 10 });
        
        // Add footer with terms
        const pageHeight = doc.page.height;
        doc.fontSize(8)
           .fillColor('#888')
           .text('This ticket is non-refundable and non-transferable. By using this ticket, you agree to the terms and conditions.', 
                 50, pageHeight - 80, 
                 { align: 'center', width: doc.page.width - 100 });
           
        doc.end();

        // Create email transporter
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });


        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: `Your Ticket for ${ticket.event.title}`,
            text: `Thank you for purchasing a ticket for ${ticket.event.title}. Your ticket is attached.`,
            attachments: [{
                filename: `ticket_${ticket._id}.pdf`,
                path: pdfPath,
                contentType: 'application/pdf'
            }]
        };

        await transporter.sendMail(mailOptions);
        console.log(`Ticket email sent to ${email}`);
        return true;
    } catch (error) {
        console.error("Error sending ticket email:", error);
        return false;
    }
};

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
                .populate("organizer")

            if (!eventbuying) return res.status(404).json({ message: "Event not found!" });
            const ticketCode = `TICKET-${Math.random().toString(36).substring(2, 15)}`; // Generate a unique ticket code

            // Creating Ticket
            const newTicket = new Ticket({
                user: req.user.user._id,
                event: eventbuying._id,
                quantity: 1,
                price: eventbuying.price,
                ticketCodes: ticketCode,
                purchaseDate: new Date(),
            });
            await newTicket.save();
            const populatedTicket = await Ticket.findById(newTicket._id)
                .populate("event")
                .populate("user");
                console.log("Populated ticket:", populatedTicket);
            
                await sendEventTicketEmail(populatedTicket.user.email, populatedTicket);
            res.status(200).json({ success: true, message: "Payment verified successfully" });

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

const bookingOverAllDetail = async (req, res) => {
    try {
      const userId = req.user.user._id;
  
      // Find all events organized by the user
      const userEvents = await Event.find({ organizer: userId });
  
      if (userEvents.length === 0) {
        return res.status(200).json({
          events: [],
          totalSold: 0,
          totalRevenue: 0
        });
      }
  
      const eventIds = userEvents.map(event => event._id);
  
      // Aggregate ticket data for these events
      const ticketStats = await Ticket.aggregate([
        {
          $match: {
            event: { $in: eventIds }
          }
        },
        {
          $group: {
            _id: "$event",
            totalSold: {
              $sum: { $ifNull: ["$quantity", 0] }
            },
            totalRevenue: {
              $sum: {
                $multiply: [
                  { $ifNull: ["$quantity", 0] },
                  "$price"
                ]
              }
            }
          }
        }
      ]);
  
      // Create a map for quick lookup of ticket stats
      const statsMap = new Map();
      ticketStats.forEach(stat => {
        statsMap.set(stat._id.toString(), {
          totalSold: stat.totalSold,
          totalRevenue: stat.totalRevenue
        });
      });
  
      // Enrich events with ticket stats
      const eventsWithStats = userEvents.map(event => {
        const stat = statsMap.get(event._id.toString()) || { totalSold: 0, totalRevenue: 0 };
        return {
          ...event.toObject(),
          totalSold: stat.totalSold,
          totalRevenue: stat.totalRevenue
        };
      });
  
      // Calculate overall totals
      const totalSold = ticketStats.reduce((sum, stat) => sum + stat.totalSold, 0);
      const totalRevenue = ticketStats.reduce((sum, stat) => sum + stat.totalRevenue, 0);
  
      res.status(200).json({
        events: eventsWithStats,
        totalSold,
        totalRevenue
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

  // Add event to favorites
  const addFavoriteEvent = async (req, res) => {
      try {
          const eventId = req.params.id;
          const userId = req.user.user._id;; 
    
     // Check if event exists
     const event = await Event.findById(eventId);
     if (!event) {
         return res.status(404).json({ message: 'Event not found' });
     }
  
     // Add to favorites
     const user = await User.findByIdAndUpdate(
         userId,
         { $addToSet: { favoriteEvents: eventId } },
         { new: true }
     ).populate('favoriteEvents');
  
     res.status(200).json({
         success: true,
         message: 'Event added to favorites',
         favoriteEvents: user.favoriteEvents
     });
  } catch (error) {
     console.error('Error adding favorite event', error);
     res.status(500).json({ message: 'Server error', error: error.message });
  }
  };
  
    // Remove event from favorites
  const removeFavoriteEvent = async (req, res) => {
      try {
        const eventId = req.params.id;
          const userId = req.user.user._id;; 
    
        const user = await User.findByIdAndUpdate(
          userId,
          { $pull: { favoriteEvents: eventId } },
          { new: true }
        ).populate('favoriteEvents');
    
        res.status(200).json({
          success: true,
          message: 'Event removed from favorites',
          favoriteEvents: user.favoriteEvents
        });
      } catch (error) {
        console.error('Error removing favorite event:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
      }
    };
  
    // Get user's favorite events
  const getFavoriteEvents = async (req, res) => {
      try {
        const userId = req.user.user._id;; 
    
        const user = await User.findById(userId).populate('favoriteEvents');
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        res.status(200).json(user.favoriteEvents);
      } catch (error) {
        console.error('Error getting favorite events:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
      }
    };

module.exports = { createEvent, getAllEvents, updateEvent, deleteEvent, findEventById, buyEventTicket, verifyEventPayment, bookingOverAllDetail, addFavoriteEvent, removeFavoriteEvent, getFavoriteEvents };