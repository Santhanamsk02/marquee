# backend/run_code.py
import subprocess
import uuid
import os

def run_code(language, code):
    filename = f"{uuid.uuid4()}"
    if language == "python":
        filepath = f"{filename}.py"
        with open(filepath, "w") as f:
            f.write(code)
        cmd = ["python", filepath]
    elif language == "c":
        filepath = f"{filename}.c"
        with open(filepath, "w") as f:
            f.write(code)
        exe_file = f"{filename}.exe"
        subprocess.run(["gcc", filepath, "-o", exe_file], timeout=5)
        cmd = [exe_file]
    else:
        return {"error": "Unsupported language"}

    try:
        result = subprocess.run(cmd, capture_output=True, timeout=5, text=True)
        return {
            "stdout": result.stdout.strip(),
            "stderr": result.stderr.strip(),
            "success": result.returncode == 0
        }
    except Exception as e:
        return {"error": str(e)}
