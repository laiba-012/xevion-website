import React, { useState } from "react";
import api from "../../utils/api";

const CreateInstructor = () => {

const [formData, setFormData] = useState({

  name: "",

  email: "",

  password: "",

  phone: "",

  qualification: "",

  experience: "",

  specialization: "",

  gender: "",

  address: "",

  bio: "",

});

const [profileImage, setProfileImage] = useState(null);

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

   const handleChange = (e) => {

  setFormData({

    ...formData,

    [e.target.name]: e.target.value,

  });

};

const handleSubmit = async (e) => {

  e.preventDefault();

  setLoading(true);

  setMessage("");

  setError("");

  try {

    const data = new FormData();

    Object.keys(formData).forEach((key) => {

      data.append(key, formData[key]);

    });

    if (profileImage) {

      data.append("profileImage", profileImage);

    }

    const res = await api.post(

      "/admin/instructors",

      data,

      {

        headers: {

          "Content-Type": "multipart/form-data",

        },

      }

    );

    setMessage(res.data.message);

  } catch (err) {

    setError(

      err.response?.data?.message ||

      "Something went wrong"

    );

  }

  setLoading(false);

};

    return (

        <div style={styles.container}>

            <div style={styles.card}>

                <h2>Create Instructor</h2>

                {message &&

                    <div style={styles.success}>

                        {message}

                    </div>

                }

                {error &&

                    <div style={styles.error}>

                        {error}

                    </div>

                }

                <form onSubmit={handleSubmit}>

                   <input
    style={styles.input}
    type="file"
    onChange={(e) => setProfileImage(e.target.files[0])}
/>

<input
    style={styles.input}
    name="name"
    placeholder="Full Name"
    value={formData.name}
    onChange={handleChange}
/>

<input
    style={styles.input}
    name="email"
    placeholder="Email"
    value={formData.email}
    onChange={handleChange}
/>

<input
    style={styles.input}
    type="password"
    name="password"
    placeholder="Password"
    value={formData.password}
    onChange={handleChange}
/>

<input
    style={styles.input}
    name="phone"
    placeholder="Phone Number"
    value={formData.phone}
    onChange={handleChange}
/>

<input
    style={styles.input}
    name="qualification"
    placeholder="Qualification"
    value={formData.qualification}
    onChange={handleChange}
/>

<input
    style={styles.input}
    name="experience"
    placeholder="Experience"
    value={formData.experience}
    onChange={handleChange}
/>

<input
    style={styles.input}
    name="specialization"
    placeholder="Specialization"
    value={formData.specialization}
    onChange={handleChange}
/>

<select
    style={styles.input}
    name="gender"
    value={formData.gender}
    onChange={handleChange}
>
    <option value="">Select Gender</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
</select>

<textarea
    style={styles.input}
    name="address"
    placeholder="Address"
    value={formData.address}
    onChange={handleChange}
/>

<textarea
    style={styles.input}
    name="bio"
    placeholder="Short Bio"
    value={formData.bio}
    onChange={handleChange}
/>

                    <button

                        type="submit"

                        style={styles.button}

                    >

                        {

                            loading

                            ?

                            "Creating..."

                            :

                            "Create Instructor"

                        }

                    </button>

                </form>

            </div>

        </div>

    );

};

const styles = {

container:{

display:"flex",

justifyContent:"center",

padding:40

},

card:{

width:500,

background:"#fff",

padding:30,

borderRadius:10,

boxShadow:"0 0 10px rgba(0,0,0,.1)"

},

input:{

width:"100%",

padding:12,

marginBottom:15,

borderRadius:8,

border:"1px solid #ccc"

},

button:{

width:"100%",

padding:12,

background:"#4f46e5",

color:"#fff",

border:"none",

borderRadius:8,

cursor:"pointer"

},

success:{

background:"#d1fae5",

padding:10,

marginBottom:15,

color:"green"

},

error:{

background:"#fee2e2",

padding:10,

marginBottom:15,

color:"red"

}

};




export default CreateInstructor;