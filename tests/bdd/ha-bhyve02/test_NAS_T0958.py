# coding=utf-8
"""High Availability (tn-bhyve01) feature tests."""

import time
import xpaths
from function import (
    wait_on_element,
    is_element_present,
    attribute_value_exist,
    wait_on_element_disappear
)
from pytest_bdd import (
    given,
    scenario,
    then,
    when,
    parsers
)
from pytest_dependency import depends


@scenario('features/NAS-T958.feature', 'Change user home directory permissions')
def test_change_user_home_directory_permissions(driver):
    """Change user home directory permissions."""
    pass


@given(parsers.parse('The browser is open navigate to "{nas_url}"'))
def the_browser_is_open_navigate_to_nas_url(driver, nas_url, request):
    """The browser is open navigate to "{nas_url}"."""
    depends(request, ['First_User'], scope='session')
    if nas_url not in driver.current_url:
        driver.get(f"http://{nas_url}/ui/sessions/signin")
        time.sleep(1)


@when(parsers.parse('If login page appear enter "{user}" and "{password}"'))
def if_login_page_appear_enter_root_and_password(driver, user, password):
    """If login page appear enter "{user}" and "{password}"."""
    if not is_element_present(driver, xpaths.sideMenu.dashboard):
        assert wait_on_element(driver, 5, xpaths.login.user_input)
        driver.find_element_by_xpath(xpaths.login.user_input).clear()
        driver.find_element_by_xpath(xpaths.login.user_input).send_keys(user)
        driver.find_element_by_xpath(xpaths.login.password_input).clear()
        driver.find_element_by_xpath(xpaths.login.password_input).send_keys(password)
        assert wait_on_element(driver, 5, xpaths.login.signin_button, 'clickable')
        driver.find_element_by_xpath(xpaths.login.signin_button).click()
    else:
        driver.find_element_by_xpath(xpaths.sideMenu.dashboard).click()


@then('You should see the dashboard')
def you_should_see_the_dashboard(driver):
    """You should see the dashboard."""
    assert wait_on_element(driver, 10, xpaths.dashboard.title)
    assert wait_on_element(driver, 10, xpaths.dashboard.systemInfoCardTitle)


@then('Click on the Credentials item in the left side menu')
def click_on_the_credentials_item_in_the_left_side_menu(driver):
    """Click on the Credentials item in the left side menu."""
    driver.find_element_by_xpath(xpaths.sideMenu.credentials).click()


@then('The Credentials menu should expand to the right')
def the_credentials_menu_should_expand_to_the_right(driver):
    """The Credentials menu should expand to the right."""
    assert wait_on_element(driver, 7, '//div[contains(@class,"lidein-nav-md")]//mat-list-item[@ix-auto="option__Local Users"]', 'clickable')


@then('Click on Local Users')
def click_on_localusers(driver):
    """Click on Local Users."""
    driver.find_element_by_xpath('//div[contains(@class,"lidein-nav-md")]//mat-list-item[@ix-auto="option__Local Users"]').click()


@then('The Users page should open')
def the_users_page_should_open(driver):
    """The Users page should open."""
    assert wait_on_element(driver, 7, '//h1[text()="Users"]')


@then('On the right side of the table, click the expand arrow for one of the users')
def on_the_right_side_of_the_table_click_the_expand_arrow_for_one_of_the_users(driver):
    """On the right side of the table, click the expand arrow for one of the users."""
    assert wait_on_element(driver, 7, '//tr[contains(.,"ericbsd")]/td')
    driver.find_element_by_xpath('//tr[contains(.,"ericbsd")]/td').click()


@then('The User Field should expand down to list further details')
def the_user_field_should_expand_down_to_list_further_details(driver):
    """The User Field should expand down to list further details."""
    assert wait_on_element(driver, 7, '//tr[contains(.,"ericbsd")]/following-sibling::ix-user-details-row//button[contains(.,"Edit")]', 'clickable')


@then('Click the Edit button that appears')
def click_the_edit_button_that_appears(driver):
    """Click the Edit button that appears."""
    driver.find_element_by_xpath('//tr[contains(.,"ericbsd")]/following-sibling::ix-user-details-row//button[contains(.,"Edit")]').click()


@then('The User Edit Page should open')
def the_user_edit_page_should_open(driver):
    """The User Edit Page should open."""
    assert wait_on_element(driver, 7, '//h3[text()="Edit User"]')
    time.sleep(1)


@then('Change the permissions for the Users Home Directory (invert them) and click save')
def change_the_permissions_for_the_users_home_directory_invert_them_and_click_save(driver):
    """Change the permissions for the Users Home Directory (invert them) and click save."""
    assert wait_on_element(driver, 7, '//span[text()="Home Directory Permissions"]')
    assert wait_on_element(driver, 5, '(//tr[contains(.,"Group")]//mat-checkbox)[2]', 'clickable')
    driver.find_element_by_xpath('(//tr[contains(.,"Group")]//mat-checkbox)[2]').click()
    driver.find_element_by_xpath('(//tr[contains(.,"Group")]//mat-checkbox)[3]').click()
    driver.find_element_by_xpath('(//tr[contains(.,"Other")]//mat-checkbox)[2]').click()
    driver.find_element_by_xpath('(//tr[contains(.,"Other")]//mat-checkbox)[3]').click()
    assert wait_on_element(driver, 5, '//button[contains(.,"Save")]', 'clickable')
    driver.find_element_by_xpath('//button[contains(.,"Save")]').click()
    assert wait_on_element_disappear(driver, 15, xpaths.progress.progressbar)


@then('Change should be saved')
def change_should_be_saved(driver):
    """Change should be saved."""
    assert wait_on_element(driver, 7, '//h1[text()="Users"]')
    assert wait_on_element(driver, 10, '//td[contains(.,"ericbsd")]')


@then('Reopen the user edit page and ensure that the additional Aux Group was saved')
def reopen_the_user_edit_page_and_ensure_that_the_additional_aux_group_was_saved(driver):
    """Reopen the user edit page and ensure that the additional Aux Group was saved."""
    assert wait_on_element(driver, 7, '//tr[contains(.,"ericbsd")]/td', 'clickable')
    driver.find_element_by_xpath('//tr[contains(.,"ericbsd")]/td').click()
    assert wait_on_element(driver, 5, '//tr[contains(.,"ericbsd")]/following-sibling::ix-user-details-row//button[contains(.,"Edit")]', 'clickable')
    driver.find_element_by_xpath('//tr[contains(.,"ericbsd")]/following-sibling::ix-user-details-row//button[contains(.,"Edit")]').click()
    assert wait_on_element(driver, 5, '//h3[text()="Edit User"]')
    assert wait_on_element(driver, 5, '//legend[normalize-space(text())="Identification"]')
    time.sleep(1)


@then('The changed permissions should be what they were changed to')
def the_changed_permissions_should_be_what_they_were_changed_to(driver):
    """The changed permissions should be what they were changed to."""
    assert wait_on_element(driver, 7, '//span[text()="Home Directory Permissions"]')
    assert wait_on_element(driver, 5, '(//tr[contains(.,"Group")]//mat-checkbox)[2]', 'clickable')
    assert attribute_value_exist(driver, '(//tr[contains(.,"User")]//mat-checkbox)[1]', 'class', 'mat-checkbox-checked')
    assert attribute_value_exist(driver, '(//tr[contains(.,"User")]//mat-checkbox)[2]', 'class', 'mat-checkbox-checked')
    assert attribute_value_exist(driver, '(//tr[contains(.,"User")]//mat-checkbox)[3]', 'class', 'mat-checkbox-checked')
    assert attribute_value_exist(driver, '(//tr[contains(.,"Group")]//mat-checkbox)[1]', 'class', 'mat-checkbox-checked')
    assert attribute_value_exist(driver, '(//tr[contains(.,"Group")]//mat-checkbox)[2]', 'class', 'mat-checkbox-checked')
    assert attribute_value_exist(driver, '(//tr[contains(.,"Group")]//mat-checkbox)[3]', 'class', 'mat-checkbox-checked') is False
    assert attribute_value_exist(driver, '(//tr[contains(.,"Other")]//mat-checkbox)[1]', 'class', 'mat-checkbox-checked')
    assert attribute_value_exist(driver, '(//tr[contains(.,"Other")]//mat-checkbox)[2]', 'class', 'mat-checkbox-checked')
    assert attribute_value_exist(driver, '(//tr[contains(.,"Other")]//mat-checkbox)[3]', 'class', 'mat-checkbox-checked') is False
    # setting back the original permission for future test
    assert wait_on_element(driver, 5, '(//tr[contains(.,"Group")]//mat-checkbox)[2]', 'clickable')
    driver.find_element_by_xpath('(//tr[contains(.,"Group")]//mat-checkbox)[2]').click()
    driver.find_element_by_xpath('(//tr[contains(.,"Group")]//mat-checkbox)[3]').click()
    driver.find_element_by_xpath('(//tr[contains(.,"Other")]//mat-checkbox)[2]').click()
    driver.find_element_by_xpath('(//tr[contains(.,"Other")]//mat-checkbox)[3]').click()
    assert wait_on_element(driver, 5, '//button[contains(.,"Save")]', 'clickable')
    driver.find_element_by_xpath('//button[contains(.,"Save")]').click()
    assert wait_on_element_disappear(driver, 15, xpaths.progress.progressbar)
    assert wait_on_element(driver, 5, '//h1[text()="Users"]')
    assert wait_on_element(driver, 10, '//td[contains(.,"ericbsd")]')
