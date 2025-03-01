import { NextRequest, NextResponse } from "next/server";

import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect();


export async function POST(request: NextRequest) {
    try {
        let userList = await User.find();

        if (!userList) {
            userList = [];
        }
        return NextResponse.json({
            data: userList,
            status: true,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}