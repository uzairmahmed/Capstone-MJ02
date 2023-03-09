import subprocess, re, json

def list_system_stats():
    cmd = 'iw'
    temp = subprocess.Popen(['top', '-b', '-n', '1'], stdout = subprocess.PIPE)
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
