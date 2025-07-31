from fastapi import APIRouter, HTTPException
from db import students_collection, results_collection, questions_collection
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/admin")

# Student Model
class Student(BaseModel):
    name: str
    rollno: str
    username:str
    password: str
    email: str
    mobile: str
    classSection: str
    department: str
    cgpa: float
    regno: str

@router.post("/students")
def add_student(student: Student):
    students_collection.insert_one(student.dict())
    return {"message": "Student added"}

@router.get("/students")
def get_students():
    return list(students_collection.find({}, {"_id": 0}))

@router.put("/students/{username}")
def update_student(username: str, student: Student):
    result = students_collection.update_one({"username": username}, {"$set": student.dict()})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student updated"}

# Results
@router.get("/results")
def get_results():
    return list(results_collection.find({}, {"_id": 0}))

# Questions
class Question(BaseModel):
    id: int
    title: str
    expected_output: str

@router.post("/questions")
def add_question(q: Question):
    questions_collection.insert_one(q.dict())
    return {"message": "Question added"}

@router.get("/questions")
def get_questions():
    print(list(questions_collection.find({}, {"_id": 0})))
    return list(questions_collection.find({}, {"_id": 0}))

@router.put("/questions/{id}")
def update_question(id: int, q: Question):
    result = questions_collection.update_one({"id": id}, {"$set": q.dict()})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Question not found")
    return {"message": "Question updated"}
