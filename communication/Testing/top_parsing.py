import subprocess, re, json

def list_system_stats():
<<<<<<< HEAD
    cmd = 'iw'
    temp = subprocess.Popen(['top', '-b', '-n', '1'], stdout = subprocess.PIPE)
=======
    temp = subprocess.Popen(['top', ' -b'], stdout = subprocess.PIPE)
>>>>>>> bd4b033a290b8f65169c072960a708e3071b01f3
    output = temp.communicate()[0]
    return output.decode('ascii')


def parse_system_stats(stats):
    list_of_stats = stats.split('\n')
    print(list_of_stats[0])
    print(list_of_stats[1])
    print(list_of_stats[2])
    print(list_of_stats[3])
    print(list_of_stats[4])

parse_system_stats(list_system_stats())
