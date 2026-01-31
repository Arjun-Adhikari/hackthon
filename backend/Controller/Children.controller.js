import Children from '../Model/Children.model.js'



export const getChildren = async (req, res) => {
    try {
        const data = await Children.find()
        return res.json(data);
    } catch (error) {
        console.error("Error during getting the data", error)
        return res.status(500).json({ msg: "Error getting data" })
    }
}

export const addChildren = async (req, res) => {
    try {
        console.log('chech');
        
        const { name, dateOfBirth, gender, bloodGroup, allergies, medicalConditions } = req.body;
        const data = new Children({
            name,
            dateOfBirth,            
            gender,
            bloodGroup,
            allergies,
            medicalConditions
        })  
        await data.save()
        return res.json('Data added successfully', data);
    } catch (error) {
        console.error("Error during getting the data", error)
        return res.status(500).json({ msg: "Error getting data" })
    }
}
