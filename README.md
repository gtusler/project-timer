# project-timer
The idea with this one is to keep track of the time I'm spending on projects.

```sh
timer start projectName
timer stop projectName
timer abort projectName
timer count projectName
timer list
```


## Installing
Clone the repo and run:
```sh
bun install
```

Then you'll probably want to do something like:
```sh
ln -s ~/path-to-repo/project-timer/src/cli.ts ~/somewhere-on-PATH/bin/timer
```

