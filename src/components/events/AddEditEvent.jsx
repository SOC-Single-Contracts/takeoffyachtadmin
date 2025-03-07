import React, { useState } from 'react';
import axios from 'axios';

const AddEditEvent = ({ event }) => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        title: '',
        longitude: '',
        latitude: '',
        cancel_time_in_hour: '',
        status: '',
        duration_hour: '',
        total_tickets: '',
        notes: '',
        description: '',
        user_id: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (event) {
            // PUT request for editing an event
            await axios.put(`https://api.takeoffyachts.com/yacht/event/`, { ...formData, event_id: event.id });
        } else {
            // POST request for adding a new event
            await axios.post(`https://api.takeoffyachts.com/yacht/event/`, formData);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
            <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
            <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
            <input type="text" name="longitude" placeholder="Longitude" onChange={handleChange} required />
            <input type="text" name="latitude" placeholder="Latitude" onChange={handleChange} required />
            <input type="number" name="cancel_time_in_hour" placeholder="Cancel Time (hours)" onChange={handleChange} required />
            <input type="text" name="status" placeholder="Status" onChange={handleChange} required />
            <input type="number" name="duration_hour" placeholder="Duration (hours)" onChange={handleChange} required />
            <input type="number" name="total_tickets" placeholder="Total Tickets" onChange={handleChange} required />
            <textarea name="notes" placeholder="Notes" onChange={handleChange} />
            <textarea name="description" placeholder="Description" onChange={handleChange} required />
            <input type="text" name="user_id" placeholder="User ID" onChange={handleChange} required />
            <button type="submit">{event ? 'Edit' : 'Add'} Event</button>
        </form>
    );
};

export default AddEditEvent;
