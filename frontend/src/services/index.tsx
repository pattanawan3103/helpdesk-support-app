import { Ticket } from "../interfaces/ticket";

const apiUrl = "http://localhost:8080"; // ตรวจสอบให้แน่ใจว่า backend ทำงานที่พอร์ตนี้

async function GetTickets(): Promise<Ticket[]> {
  try {
    const response = await fetch(`${apiUrl}/tickets`, { method: 'GET' });
    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch tickets: ${response.statusText}. ${errorText}`);
    }

    const res = await response.json();
    console.log('Data received:', res);

    if (Array.isArray(res)) {
      return res; // Return the array directly
    } else if (res.tickets && Array.isArray(res.tickets)) {
      return res.tickets; // Return the tickets array
    } else {
      throw new Error("Data is not in the expected format");
    }
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return []; // คืนค่า array ว่างเมื่อมีข้อผิดพลาด
  }
}

async function CreateTicket(data: Ticket) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(`${apiUrl}/ticket`, requestOptions);
    console.log("CreateTicket Response status:", response.status); // บันทึกสถานะการตอบกลับ

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create ticket: ${response.statusText}. ${errorText}`);
    }

    const res = await response.json();
    console.log('Response from server:', res); // เพิ่ม log เพื่อตรวจสอบ response

    if (res.data) {
      return { status: true, message: res.data };
    } else {
      return { status: false, message: res.error || 'Error occurred' };
    }
  } catch (error) {
    console.error('Fetch error:', error); // จัดการข้อผิดพลาดที่เกิดขึ้น
    return { status: false, message: 'Fetch error' };
  }
}

async function UpdateTicket(id: string, data: Ticket) {
  const requestOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(`${apiUrl}/ticketlists/${id}`, requestOptions);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error details from server: ${errorText}`); // เพิ่มการ log ข้อมูลผิดพลาด
      throw new Error(`Failed to update ticket: ${response.statusText}. ${errorText}`);
    }

    const res = await response.json();
    if (res.data) {
      return { status: true, message: res.data };
    } else {
      return { status: false, message: res.error || 'Error occurred' };
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return { status: false, message: 'Fetch error' };
  }
}


export default { 
  GetTickets, 
  CreateTicket,
  UpdateTicket 
};
