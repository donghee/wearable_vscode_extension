# 요구사항

## 요약

다음은 ROS2 기반의 '웨어러블 로봇 개발을 위한 Visual Studio Code의 Extension' 이다.

## Top-level 요구사항

Visual Studio Code의 'Wearable Robot' Extension을 실행하면 'New Project', 'Build', 'Simulate' 버튼이 있다. 
'New Project' 버튼을 누루면 ROS2 기반의 웨어러블 로봇 프로젝트가 생성이 되고, 'Build' 버튼을 누루면 ROS2 프로젝트가 컴파일 된다. 그리고 'Simulate' 버튼을 누르면 Visual Studio Code의 별도의 탭에 ROS2 프로젝트의 시뮬레이션 결과가 나온다.

## High-level 요구사항

- Visual Studio Code의 'Wearable Robot' Extension 에서 'New Project' 버튼을 누르면 웨어러블 로봇을 위한 템플릿 프로젝트를 읽어서 새 프로젝트를 생성한다.
- 'Build' 버튼을 누르면 ROS2 humble Docker 컨테이너를 이용하여 만들어진 프로젝트가 빌드가 된다. 
- 'Simulate' 버튼을 누루면 ROS2 humble Docker 컨테이너에 설치된 novnc를 이용하여 원격 접속하고, 그 원격 접속 화면은 시뮬레이션 탭에 띄운다. 시뮬레이션 탭에 gazebo를 실행하고 Build된 새로운 프로젝트를 실행한다.

## Mid-level 요구사항

New Project 버튼을 누를때 실행하는 단계

1. ROS2 humble Docker 이미지를 생성한다. 
2. ROS2 humble Docker 컨테이너를 실행한다. 컨테이너의 이름을 'wearable_robot' 이라고 한다. 
3. ROS2 humble Docker 이미지가 이미 있거나 'wearable_robot' Docker 컨테이너가 있으면 이미지 생성과 컨테이너 실행을 하지 않는다.
3. 컨테이너 안에 https://github.com/donghee/wearable_robot_upper_limb 를 다운로드 받는다. 
4. 터미널 열어서 'wearable_robot' Docker 컨테이너에 attach 한다.
5. wearable_robot_upper_limb 프로젝트를 Visual Studio Code 편집 화면으로 오픈한다.

Build 버튼을 누를때 실행하는 단계
1. 'wearable_robot' Docker 컨테이너 내부에 있는 wearable_robot_upper_limb 프로젝트 빌드한다.
2. ROS2 workspace를 설정한다. workspace 위치는 ~/ros2_ws 이다
3. workspace 내부의 ROS 환경 변수를 읽고, workspace안에서 'colcon build --symlink-install' 명령을 실행한다. 

Simulate 버튼을 누를때 실행하는 단계
1. 시뮬레이션 탭을 오픈한다. 
2. 시뮬레이션 탭은 wearable_robot 컨테이너에서 실행된 novnc 웹 화면에 접속한다.
3. gazebo를 실행한다.

## Low-level 요구사항

## Code quality 요구사항

