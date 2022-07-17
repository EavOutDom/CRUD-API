import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
    const [contact, setContact] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");
    const [tempId, setTempId] = useState(null);
    const [update, setUpdate] = useState(false);

    //post and put request
    const handleAddUpdate = async (e) => {
        e.preventDefault();

        //put request
        if (update) {
            try {
                const response = await axios.put(
                    `http://localhost:3001/contact/${tempId}`,
                    {
                        name: name,
                        email: email,
                        description: description,
                    }
                );
                const data = response.data;
                setContact(
                    contact.map((contact) =>
                        contact.id === tempId
                            ? {
                                  ...contact,
                                  //   name: name,
                                  //   email: email,
                                  //   description: description,
                                  name: data.name,
                                  email: data.email,
                                  description: data.description,
                              }
                            : contact
                    )
                );
                setUpdate(false);
                setName("");
                setEmail("");
                setDescription("");
            } catch (error) {
                console.log(error);
            }
        } else {
            //post request
            if (name && email && description) {
                try {
                    const response = await axios.post(
                        "http://localhost:3001/contact",
                        {
                            name: name,
                            email: email,
                            description: description,
                        }
                    );
                    const data = response.data;
                    setContact([...contact, data]);
                    setName("");
                    setEmail("");
                    setDescription("");
                } catch (error) {
                    console.log(error);
                }
            } else {
                alert("Please fill all the fields");
            }
        }
    };

    //delete request
    const handleDelete = (id) => {
        try {
            axios.delete(`http://localhost:3001/contact/${id}`);
            setContact(contact.filter((data) => data.id !== id));
        } catch (error) {
            console.log(error);
        }
    };

    //check if the contact is in the array
    const checkContact = (id) => {
        const selectedContact = contact.find((data) => data.id === id);
        if (selectedContact) {
            setName(selectedContact.name);
            setEmail(selectedContact.email);
            setDescription(selectedContact.description);
            setTempId(selectedContact.id);
            setUpdate(true);
        }
    };

    //get request
    const getContact = async () => {
        try {
            const response = await axios.get("http://localhost:3001/contact");
            const data = response.data;
            setContact(data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getContact();
    }, []);
    return (
        <div className="w-full">
            <form className="flex flex-col">
                <input
                    type="text"
                    className="mx-auto my-1"
                    placeholder="name..."
                    value={name}
                    autoFocus
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                />
                <input
                    type="text"
                    className="mx-auto my-1"
                    placeholder="email..."
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />
                <textarea
                    className="mx-auto my-1"
                    rows={2}
                    type="text"
                    placeholder="description..."
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                    }}
                />
                <button onClick={handleAddUpdate}>
                    {update ? "SAVE" : "ADD"}
                </button>
                {update && (
                    <button
                        onClick={() => {
                            setUpdate(false);
                            setName("");
                            setEmail("");
                            setDescription("");
                        }}
                    >
                        CANCEL
                    </button>
                )}
            </form>
            {contact?.map((data) => {
                return (
                    <div key={data.id} className={"flex justify-center"}>
                        <div className="my-2 bg-slate-200 p-4 rounded-md text-center">
                            <h1>{data.name}</h1>
                            <h2>{data.email}</h2>
                            <p>{data.description}</p>
                            <div>
                                <button
                                    className={"mx-4"}
                                    onClick={() => checkContact(data.id)}
                                >
                                    edit
                                </button>
                                <button
                                    className={"mx-4"}
                                    onClick={() => handleDelete(data.id)}
                                >
                                    delete
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default App;
