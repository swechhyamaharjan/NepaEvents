const Event = require('../models/event-model');
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

// Send receipt email for event payment
const sendEventTicketEmail = async (email, ticket) => {
    try {
        const ticketsDir = path.join(__dirname, "../uploads/event-tickets");

        // Ensure the tickets folder exists
        if (!fs.existsSync(ticketsDir)) {
            fs.mkdirSync(ticketsDir, { recursive: true });
        }

        const pdfPath = path.join(ticketsDir, `ticket_${ticket._id}.pdf`);

        // Primary brand color
        const primaryColor = '#ED4A43';

        // Generate QR code with ticket data
        const qrData = JSON.stringify({
            ticketId: ticket._id,
            ticketCode: ticket.ticketCodes,
            eventName: ticket.event.title,
            venueId: ticket.event.venue._id, 
            attendeeName: ticket.user.name,
            ticketPrice: ticket.event.price,
            purchaseDate: ticket.purchaseDate.toISOString(),
        });
        const qrCodeBuffer = await QRCode.toBuffer(qrData);

        const doc = new PDFDocument({
            size: 'A4',
            margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });
        // Start writing to PDF
        doc.pipe(fs.createWriteStream(pdfPath));

        
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
                user: eventbuying.organizer._id,
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

module.exports = { createEvent, getAllEvents, updateEvent, deleteEvent, findEventById, buyEventTicket, verifyEventPayment};