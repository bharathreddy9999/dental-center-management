const appointmentService = {
    getAppointments: () => {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        return appointments;
    },

    addAppointment: (appointment) => {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        appointments.push(appointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));
    },

    updateAppointment: (updatedAppointment) => {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const index = appointments.findIndex(app => app.id === updatedAppointment.id);
        if (index !== -1) {
            appointments[index] = updatedAppointment;
            localStorage.setItem('appointments', JSON.stringify(appointments));
        }
    },

    deleteAppointment: (appointmentId) => {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const filteredAppointments = appointments.filter(app => app.id !== appointmentId);
        localStorage.setItem('appointments', JSON.stringify(filteredAppointments));
    },

    getAppointmentById: (appointmentId) => {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        return appointments.find(app => app.id === appointmentId);
    }
};

export default appointmentService;