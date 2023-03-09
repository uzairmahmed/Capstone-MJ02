import subprocess, re, json

def list_system_stats():
    temp = subprocess.Popen(['top', ' -b'], stdout = subprocess.PIPE)
    output = temp.communicate()[0]
    return output.decode('ascii')

print(list_system_stats())