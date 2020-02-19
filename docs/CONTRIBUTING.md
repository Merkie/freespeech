# Contributing

 When contributing to this repository, please first discuss the change you wish to make via issue,
 email, or any other method with the owners of this repository before making a change.

 Please note we have a code of conduct, please follow it in all your interactions with the project.

## Feature Requests
We love feature requests! We want to make Freespeech as accessible to as many people as possible. If you have an
idea you'd like to see in Freespeech feel free to submit an issue outlining it. Or even a Pull Request implementing the
change! Although we won't be able to implement every feature everyone may make or want. We want to get as many as possible
that improves Freespeech.

## <a name="issue"></a> Found an Issue?

If you find a bug in the source code or any other issues you can help us by
submitting an issue to our [GitHub Repository](https://github.com/Merkie/freespeech/issues). Even better you can submit a Pull Request
with a fix.

### Submitting an Issue
Before you submit your issue search the archive, maybe your question was already answered.

If your issue appears to be a bug and hasn't been reported, open a new issue. Help us to maximize
the effort we can spend fixing issues and adding new features, by not reporting duplicate issues.
Providing the following information will increase the chances of your issue being dealt with
quickly:

* **Overview of the Issue** - Detail of what the bug is
* **Web browser and Operating System** - this helps us track down and reproduce the error  
* **Reproduce the Error** - provide details, if possible, on how to reproduce the error
* **Pictures/video of the bug** - if available this really shows us what the issue is.
* **Related Issues** - has a similar issue been reported before?
* **Suggest a Fix** - if you can't fix the bug yourself, perhaps you can point to what might be causing the problem (line of code or commit)

 ##  <a name="prProcess"></a> Pull Request Process
Before you submit your pull request consider the following guidelines:

* Search [GitHub](https://github.com/Merkie/freespeech/pulls) for an open or closed Pull Request
  that relates to your submission. You don't want to duplicate effort.
* [Fork](https://help.github.com/articles/fork-a-repo/) this repo.
* [Clone](https://help.github.com/articles/cloning-a-repository/) your copy.
    ```shell
    git clone https://github.com/YOUR_USERNAME/freespeech.git
    cd freespeech/
    ```
* After cloning, set a new remote [upstream](https://help.github.com/articles/configuring-a-remote-for-a-fork/) (this helps to keep your fork up to date)
    
    ```shell
    git remote add upstream https://github.com/Merkie/freespeech.git
    ```

* Make your changes in a new git branch:

    ```shell
    git checkout -b my-fix-branch master
    ```

* Commit your changes using a descriptive commit message.

    ```shell
    git commit -a
    ```
  Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

* Push your branch to GitHub:

    ```shell
    git push origin my-fix-branch
    ```

In GitHub, send a pull request to `freespeech:master`.
If we suggest changes, then:

* Make the required updates.
* Re-run freespeech and make sure your change still preforms as expected.
* Commit your changes to your branch (e.g. `my-fix-branch`).
* Push the changes to your GitHub repository (this will update your Pull Request).

If the PR gets too outdated we may ask you to rebase and force push to update the PR:

```shell
git fetch upstream
git rebase upstream/master
git push origin my-fix-branch -f
```

That's it! Thank you for your contribution! 


Most of is text is taken from the [RuneLite repo](https://github.com/runelite/runelite/blob/master/.github/CONTRIBUTING.md).
Thank you for the great template of a CONTRIBUTING guide and such great examples of git commands!

 ## Code of Conduct

 ### Our Pledge

 In the interest of fostering an open and welcoming environment, we as
 contributors and maintainers pledge to making participation in our project and
 our community a harassment-free experience for everyone, regardless of age, body
 size, disability, ethnicity, gender identity and expression, level of experience,
 nationality, personal appearance, race, religion, or sexual identity and
 orientation.

 ### Our Standards

 Examples of behavior that contributes to creating a positive environment
 include:

 * Using welcoming and inclusive language
 * Being respectful of differing viewpoints and experiences
 * Gracefully accepting constructive criticism
 * Focusing on what is best for the community
 * Showing empathy towards other community members

 Examples of unacceptable behavior by participants include:

 * The use of sexualized language or imagery and unwelcome sexual attention or
 advances
 * Trolling, insulting/derogatory comments, and personal or political attacks
 * Public or private harassment
 * Publishing others' private information, such as a physical or electronic
 address, without explicit permission
 * Other conduct which could reasonably be considered inappropriate in a
 professional setting

 ### Our Responsibilities

 Project maintainers are responsible for clarifying the standards of acceptable
 behavior and are expected to take appropriate and fair corrective action in
 response to any instances of unacceptable behavior.

 Project maintainers have the right and responsibility to remove, edit, or
 reject comments, commits, code, wiki edits, issues, and other contributions
 that are not aligned to this Code of Conduct, or to ban temporarily or
 permanently any contributor for other behaviors that they deem inappropriate,
 threatening, offensive, or harmful.

 ### Scope

 This Code of Conduct applies both within project spaces and in public spaces
 when an individual is representing the project or its community. Examples of
 representing a project or community include using an official project e-mail
 address, posting via an official social media account, or acting as an appointed
 representative at an online or offline event. Representation of a project may be
 further defined and clarified by project maintainers.

 ### Enforcement

 Instances of abusive, harassing, or otherwise unacceptable behavior may be
 reported by contacting the project team at [INSERT EMAIL ADDRESS]. All
 complaints will be reviewed and investigated and will result in a response that
 is deemed necessary and appropriate to the circumstances. The project team is
 obligated to maintain confidentiality with regard to the reporter of an incident.
 Further details of specific enforcement policies may be posted separately.

 Project maintainers who do not follow or enforce the Code of Conduct in good
 faith may face temporary or permanent repercussions as determined by other
 members of the project's leadership.

 ### Attribution

 This Code of Conduct is a template provided by [@PurpleBooth](https://gist.github.com/PurpleBooth/b24679402957c63ec426).

 That Code of Conduct is adapted from the [Contributor Covenant][homepage], version 1.4,
 available at [http://contributor-covenant.org/version/1/4][version]

 [homepage]: http://contributor-covenant.org
 [version]: http://contributor-covenant.org/version/1/4/