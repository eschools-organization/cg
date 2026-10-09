import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawId = (body.teacherId || body.ID || body.user_ID || body.id || "").toString().trim();

    if (!rawId) {
      return NextResponse.json({ message: "მასწავლებლის ID მითითებული არ არის" }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection("teachers");

    let teacher = null;
    if (ObjectId.isValid(rawId)) {
      teacher = await collection.findOne({ _id: new ObjectId(rawId) });
    }
    if (!teacher) {
      teacher = await collection.findOne({ ID: rawId });
    }
    if (!teacher) {
      teacher = await collection.findOne({ user_ID: rawId });
    }

    if (!teacher) {
      return NextResponse.json({ message: "მასწავლებელი ვერ მოიძებნა" }, { status: 404 });
    }

    const returnId = teacher.ID || teacher.user_ID || teacher._id.toString();

    return NextResponse.json({
      message: "ავტორიზაცია წარმატებით დასრულდა",
      user_ID: returnId,
      ID: returnId,
      _id: teacher._id.toString(),
      role: "teacher"
    });
  } catch (error: any) {
    console.error("Teacher impersonation error:", error);
    return NextResponse.json({ message: "სერვერის შეცდომა. გთხოვთ სცადოთ მოგვიანებით." }, { status: 500 });
  }
}
