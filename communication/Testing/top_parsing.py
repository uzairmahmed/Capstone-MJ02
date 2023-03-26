import subprocess, re, json, psutil, os, threading

def list_system_stats_python():
    threading.Timer(5.0, list_system_stats_python).start()

    total_CPUs = psutil.cpu_count(),
    avg_loads = [x / psutil.cpu_count() * 100 for x in psutil.getloadavg()]

    collector_command = ['service', 'firebase_collector', 'status']
    server_command = ['service', 'react_server', 'status']
    kiosk_command = ['service', 'kiosk', 'status']

    vals = {
        "total_memory": psutil.virtual_memory().total,
        "used_memory": psutil.virtual_memory().used,
        "total_swap": psutil.swap_memory().total,
        "used_swap": psutil.swap_memory().used,
        "total_disk": psutil.disk_usage('/').total,
        "used_disk": psutil.disk_usage('/').used,
        "avg_load_1_min": avg_loads[0],
        "firebase_collector": not bool (subprocess.call(collector_command, stdout = subprocess.PIPE)),
        "react_server": not bool (subprocess.call(server_command, stdout = subprocess.PIPE)),
        "kiosk_display": not bool (subprocess.call(kiosk_command, stdout = subprocess.PIPE)),
    }
    print(vals)

list_system_stats_python()