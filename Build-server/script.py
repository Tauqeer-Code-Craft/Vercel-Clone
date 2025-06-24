import subprocess
import os 

def main():
    print("Executing script.py")

    out_dir = os.path.join(os.path.dirname(__file__), "output")
    try:
        #installation of requirement
        subprocess.run(['pip','install','-r','requirement.txt'], cwd=out_dir, check=True)
        subprocess.run(["python",'app.py'],cwd=out_dir, check=True)
    except subprocess.CalledProcessError as e:
        print(f'Error: {e}')
    print('Python Build Complete')

if __name__ == "__main__":
    main()

                                    