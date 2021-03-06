# 持续集成

## 基本要求

基本要求：要将这种实践付诸实际，需要一些必要的条件，如下

1. 一个自动构建过程，包括自动编译、分发、部署和测试等
2. 一个代码存储库，即需要版本控制软件来保障代码的可维护性，同时作为构建过程的素材库。
3. 一个持续集成服务器。

## 一.原则

1. 开发人员必须及时向版本控制库中提交代码，也必须经常性地从版本控制库中更新代码到本地；
2. 需要有专门的集成服务器来执行集成构建。根据项目的具体实际，集成构建可以被软件的修改来直接触发，也可以定时启动，如每半个小时构建一次；
3. 必须保证构建的成功。如果构建失败，修复构建过程中的错误是优先级最高的工作。一旦修复，需要手动启动一次构建。
4. 不更新构建失败的代码

> 开发人员及时的提交代码进行构建是符合上述实践的，及时拉取代码可以防止工作中的分支偏离主干分支太多。定时触发构建或者通过检测代码的修改情况在触发构建都是可以的，主要是根及时的构建新的代码。如果构建失败，则必要及时处理导致失败的问题，修复后重新构建。当然构建失败的代码就不要拉到本地了，会污染一个本来是可以运行的工作区

## 持续集成工具

> jenkins  
> travis  
> gitlab  
> buddybuild

## travis

1. 生命周期

> before\_install  
> install  
> before\_script  
> script  
> aftersuccess or afterfailure  
> \[OPTIONAL\] before\_deploy  
> \[OPTIONAL\] deploy  
> \[OPTIONAL\] after\_deploy  
> after\_script

## 安全列表,只构建或排除某些分支\(可用正则\)

```bash
# blocklist
branches:
  except:
  - legacy
  - /^deploy-.*$/

# safelist
branches:
  only:
  - master
  - stable
```

## 运行不同环境的变量矩阵\(exclude/include\)

```bash
language: python
matrix:
  include:
  - name: "3.5 Unit Test"
    python: "3.5"
    env: TEST_SUITE=suite_3_5_unit
  - name: "3.5 Integration Tests"
    python: "3.5"
    env: TEST_SUITE=suite_3_5_integration
  - name: "pypy Unit Tests"
    python: "pypy"
    env: TEST_SUITE=suite_pypy_unit
script: ./test.py $TEST_SUITE
```

关于Jobs\(exclude/include\)

```bash
language: ruby
rvm:
- 1.9.3
- 2.0.0
- 2.1.0
env:
- DB=mongodb
- DB=redis
- DB=mysql
gemfile:
- Gemfile
- gemfiles/rails4.gemfile
- gemfiles/rails31.gemfile
- gemfiles/rails32.gemfile
# 以上会得到3*3*4个构建环境,以下能让你排除包含指定rvm和gemfile的文件
matrix:
  exclude:
  - rvm: 2.0.0
    gemfile: Gemfile
```

## 环境变量

```bash
env:
  global:
  - SECRET_VAR1=SECRET1
  matrix:
  - SECRET_VAR2=SECRET2
```

