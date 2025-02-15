/** @odoo-module **/

import {useService} from "@web/core/utils/hooks";

const {Component, status} = owl;

export class SendWhatsappButton extends Component {
    setup() {
        this.action = useService("action");
        this.user = useService("user");
        this.title = this.env._t("Send Whatsapp Message");
    }
    get phoneHref() {
        return "sms:" + this.props.value.replace(/\s+/g, "");
    }
    async onClick() {
        await this.props.record.save();
        this.action.doAction(
            {
                type: "ir.actions.act_window",
                target: "new",
                name: this.title,
                res_model: "whatsapp.composer",
                views: [[false, "form"]],
                context: {
                    ...this.user.context,
                    default_res_model: this.props.record.resModel,
                    default_res_id: this.props.record.resId,
                    default_number_field_name: this.props.name,
                    default_composition_mode: "comment",
                },
            },
            {
                onClose: () => {
                    if (status(this) !== "destroyed") {
                        this.props.record.load();
                        this.props.record.model.notify();
                    }
                },
            }
        );
    }
}
SendWhatsappButton.template = "mail_gateway_whatsapp.SendWhatsappButton";
