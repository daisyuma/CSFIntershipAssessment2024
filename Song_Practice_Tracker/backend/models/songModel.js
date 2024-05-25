import mongoose from "mongoose";
const songSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        }, 
        composer: {
            type: String,
            required: true,
        },
        year: {
            type: Number, 
            required: false,
        },
    }, 
    {
        timestamps: true,
    }
)
export const Song = mongoose.model('Song', songSchema);